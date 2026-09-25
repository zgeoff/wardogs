# infra

The wardogs-infra Pulumi program declares the Cloudflare side of `wardogs.love`. Pulumi state lives
in Cloudflare R2, and credentials resolve from 1Password at run time, so no secret lives on disk.

- `index.ts` declares these resources:
  - the apex and `www` records, which point at the Fly app through the Cloudflare proxy
  - the `_acme-challenge` records that let Fly issue certificates behind the proxy
  - the Full (strict) TLS mode
  - a cache rule for the hashed build files under `/assets/`
- `Pulumi.yaml` holds the project config. `Pulumi.prod.yaml` holds the `prod` stack config, and
  `pulumi stack init` creates it.
- `.env` holds `op://` references, which `op run` resolves. `.env.example` is the full set to copy.

## Prerequisites

- `op` signed in, with access to the `zgeoff` vault. The `wardogs-infra` item holds the fields that
  `.env.example` names.
- `wardogs.love` added to Cloudflare, with the registrar's nameservers set to the pair that
  Cloudflare assigns.
- A Cloudflare API token with `Zone → DNS → Edit`, `Zone → Zone Settings → Edit`, and
  `Zone → Cache Rules → Edit` on `wardogs.love`, and `Account → Workers R2 Storage → Edit`.
- R2 S3 keys for the state backend.
- The Fly app `wardogs-love`, created with `fly apps create wardogs-love`.

## One-time setup

1. Copy `.env.example` to `.env`.
2. Create the state bucket:

   ```sh
   op run --env-file=.env -- sh -c 'curl -fsS -X POST \
     "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/r2/buckets" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
     --data "{\"name\":\"$R2_STATE_BUCKET\"}"'
   ```

3. Point Pulumi at the R2 backend, create the stack, and record the zone id (Cloudflare dashboard →
   wardogs.love → Overview → Zone ID):

   ```sh
   op run --env-file=.env -- sh -c 'pulumi login \
     "s3://$R2_STATE_BUCKET?endpoint=$CLOUDFLARE_ACCOUNT_ID.r2.cloudflarestorage.com&region=auto&s3ForcePathStyle=true"'
   op run --env-file=.env -- pulumi stack init prod
   op run --env-file=.env -- pulumi config set wardogs-infra:zoneId <zone-id> --stack prod
   ```

   Commit the `Pulumi.prod.yaml` that these commands write. It holds the stack config and the
   encryption salt, and no secret.

4. Run `bun run up` to create the records.
5. Add the Fly certificates. Each command prints a DNS validation target:

   ```sh
   fly certs add wardogs.love -a wardogs-love
   fly certs add www.wardogs.love -a wardogs-love
   ```

6. Record both targets, then run `bun run up` again:

   ```sh
   op run --env-file=.env -- pulumi config set --path \
     'wardogs-infra:acmeChallengeTargets["wardogs.love"]' <apex-target> --stack prod
   op run --env-file=.env -- pulumi config set --path \
     'wardogs-infra:acmeChallengeTargets["www.wardogs.love"]' <www-target> --stack prod
   ```

7. Check the certificates with `fly certs show wardogs.love -a wardogs-love`.

**NOTE:** Between step 4 and a certificate issue, the site returns Cloudflare error 526. Full
(strict) TLS rejects the connection until Fly holds a valid certificate for the hostname.

## Deploy

```sh
bun run preview   # op run --env-file=.env -- pulumi preview
bun run up        # op run --env-file=.env -- pulumi up
```
