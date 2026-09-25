import { DnsRecord, Ruleset, ZoneSetting } from '@pulumi/cloudflare';
import { Config } from '@pulumi/pulumi';

const config = new Config();

const zoneId = config.require('zoneId');
const zoneName = config.require('zoneName');
const appHostname = config.require('appHostname');

// `fly certs add <hostname>` prints a CNAME target for each hostname. Fly validates the certificate
// through that record, since the proxy hides the Fly app from an HTTP challenge. A hostname with no
// target yet gets no record.
const acmeChallengeTargets = config.getObject<Record<string, string>>('acmeChallengeTargets') ?? {};

// Apex and www both resolve to the Fly app, through the Cloudflare proxy. Cloudflare flattens the
// apex CNAME, so no Fly IP is written here.
const apex = new DnsRecord('apex', {
  zoneId,
  name: zoneName,
  type: 'CNAME',
  content: appHostname,
  ttl: 1,
  proxied: true,
});

const www = new DnsRecord('www', {
  zoneId,
  name: `www.${zoneName}`,
  type: 'CNAME',
  content: appHostname,
  ttl: 1,
  proxied: true,
});

const acmeChallenges = Object.entries(acmeChallengeTargets).map(
  ([hostname, target]) =>
    new DnsRecord(`acme-challenge-${hostname}`, {
      zoneId,
      name: `_acme-challenge.${hostname}`,
      type: 'CNAME',
      content: target,
      ttl: 1,
      proxied: false,
    }),
);

// Full (strict): the proxy connects to Fly over TLS and checks Fly's certificate.
const sslMode = new ZoneSetting('ssl', {
  zoneId,
  settingId: 'ssl',
  value: 'strict',
});

// The Vite build hashes every file under /assets/, and the app serves them as immutable for a year.
// The rule caches them at the edge on the app's own headers.
const cacheRules = new Ruleset('cache-rules', {
  zoneId,
  name: 'Cache rules',
  kind: 'zone',
  phase: 'http_request_cache_settings',
  rules: [
    {
      description: 'Cache the hashed build assets',
      expression: 'starts_with(http.request.uri.path, "/assets/")',
      action: 'set_cache_settings',
      actionParameters: {
        cache: true,
        edgeTtl: { mode: 'respect_origin' },
        browserTtl: { mode: 'respect_origin' },
      },
      enabled: true,
    },
  ],
});

export const apexRecord = apex.name;
export const wwwRecord = www.name;
export const acmeChallengeRecords = acmeChallenges.map((record) => record.name);
export const sslModeValue = sslMode.value;
export const cacheRulesetId = cacheRules.id;
