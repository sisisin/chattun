resource "google_iam_workload_identity_pool" "chattun_pool" {
  project                   = local.project_id
  workload_identity_pool_id = "chattun-deployment"
  display_name              = "Chattun deployment pool"
  description               = "Identity pool for Chattun GitHub Actions deployment"
}

resource "google_iam_workload_identity_pool_provider" "chattun_provider" {
  project                            = local.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.chattun_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "chattun-deployment-gh"
  display_name                       = "Chattun deployment gh"

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.actor"      = "assertion.actor"
    "attribute.aud"        = "assertion.aud"
  }

  attribute_condition = "attribute.repository == 'sisisin/chattun'"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}
