use actix_web::{get, web, HttpResponse};

use crate::{
    errors::{ErrorResponseBody, ServiceError},
    models::{self, GetTaskRequest},
};

/// Retieve a File Task by ID
///
/// This endpoint retrieves a task by its id. The task is returned along with the chunks that have been created, if the file chunking has been completed.
#[utoipa::path(
    get,
    path = "/task/{task_id}",
    tag = "Task",
    context_path = "/api",
     params(
        ("task_id" = uuid::Uuid, Path, description = "The id of the task you want to retrieve."),
        ("limit" = Option<u32>, Query, description = "The number of chunks to return."),
        ("pagination_token" = Option<String>, Query, description = "The pagination token to use for the next request."),
    ),
    responses(
        (status = 200, description = "JSON response payload containing the created chunks", body = models::GetTaskResponse),
        (status = 400, description = "Error typically due to deserialization issues", body = ErrorResponseBody),
    ),
    security(
        ("api_key" = [])
    )
)]
#[get("/{task_id}")]
async fn get_task(
    task_id: web::Path<uuid::Uuid>,
    data: web::Query<GetTaskRequest>,
    clickhouse_client: web::Data<clickhouse::Client>,
) -> Result<HttpResponse, ServiceError> {
    let task_id = task_id.into_inner();
    let task = crate::operators::clickhouse::get_task(task_id, &clickhouse_client).await?;
    let result = crate::operators::clickhouse::get_task_chunks(
        task,
        data.limit,
        data.pagination_token,
        &clickhouse_client,
    )
    .await?;

    Ok(HttpResponse::Ok().json(result))
}
