import { createHash } from "crypto"
import { NextAuthOptions } from "../.."
import { EmailConfig } from "../../providers"
import { InternalOptions, InternalProvider } from "../../lib/types"

/**
 * Takes a number in seconds and returns the date in the future.
 * Optionally takes a second date parameter. In that case
 * the date in the future will be calculated from that date instead of now.
 */
export function fromDate(time, date = Date.now()) {
  return new Date(date + time * 1000)
}

export function hashToken(
  token: string,
  options: InternalOptions<EmailConfig & InternalProvider>
) {
  const { provider, secret } = options
  return (
    createHash("sha256")
      // Prefer provider specific secret, but use default secret if none specified
      .update(`${token}${provider.secret ?? secret}`)
      .digest("hex")
  )
}

/**
 * Secret used salt cookies and tokens (e.g. for CSRF protection).
 * If no secret option is specified then it creates one on the fly
 * based on options passed here. A options contains unique data, such as
 * OAuth provider secrets and database credentials it should be sufficent.
 */
export default function createSecret({
  userOptions,
  basePath,
  baseUrl,
}: {
  userOptions: NextAuthOptions
  basePath: string
  baseUrl: string
}) {
  return (
    userOptions.secret ??
    createHash("sha256")
      .update(
        JSON.stringify({
          baseUrl,
          basePath,
          ...userOptions,
        })
      )
      .digest("hex")
  )
}