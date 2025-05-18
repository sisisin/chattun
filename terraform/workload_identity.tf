resource "google_iam_workload_identity_pool" "chattun_pool" {
  project                   = var.project_id
  workload_identity_pool_id = "chattun-deployment"
  display_name              = "Chattun deployment pool"
  description               = "Identity pool for Chattun GitHub Actions deployment"
}

resource "google_iam_workload_identity_pool_provider" "chattun_provider" {
  project                            = var.project_id
  workload_identity_pool_id          = google_iam_workload_identity_pool.chattun_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "chattun-deployment-gh"
  display_name                       = "Chattun deployment gh"

  attribute_mapping = {
    "google.subject"             = "assertion.sub"
    "attribute.repository"       = "assertion.repository"
    "attribute.actor"            = "assertion.actor"
    "attribute.aud"              = "assertion.aud"
    "attribute.job_workflow_ref" = "assertion.job_workflow_ref"
  }

  # NOTE: https://medium.com/@bbeesley/notes-on-workload-identity-federation-from-github-actions-to-google-cloud-platform-7a818da2c33e
  attribute_condition = <<-EOF
    attribute.repository == 'sisisin/chattun' && (
      attribute.job_workflow_ref.startsWith('sisisin/chattun/.github/workflows/call--deploy-service.yaml') ||
      attribute.job_workflow_ref.startsWith('sisisin/chattun/.github/workflows/push--build-and-deploy.yaml')
    )
EOF

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}
