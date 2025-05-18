output "chattun_server_url" {
  value = google_cloud_run_v2_service.chattun_server.uri
}
output "region" {
  value = var.region
}
output "project_id" {
  value = var.project_id
}
output "chattun_server_service_account" {
  value = google_service_account.chattun_server.email
}
output "chattun_server_name" {
  value = google_cloud_run_v2_service.chattun_server.name
}
output "registry_name" {
  value = google_artifact_registry_repository.chattun_app.name
}
output "workload_identity_provider" {
  value = google_iam_workload_identity_pool_provider.chattun_provider.name
}
output "deployer_service_account" {
  value = google_service_account.run_deployer.email
}
