output "chattun_server_url" {
  value = google_cloud_run_v2_service.chattun_server.uri
}
output "region" {
  value = local.region
}
output "project_id" {
  value = local.project_id
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
