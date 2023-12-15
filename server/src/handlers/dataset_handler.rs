use super::auth_handler::LoggedUser;
use crate::{
    data::models::{Dataset, Pool},
    errors::ServiceError,
    operators::dataset_operator::{
        create_dataset_query, delete_dataset_by_id_query, get_dataset_by_id_query,
        update_dataset_query,
    },
};
use actix_web::{web, FromRequest, HttpMessage, HttpResponse};
use futures_util::Future;
use serde::{Deserialize, Serialize};
use std::pin::Pin;
use utoipa::ToSchema;

impl FromRequest for Dataset {
    type Error = ServiceError;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(
        req: &actix_web::HttpRequest,
        _payload: &mut actix_web::dev::Payload,
    ) -> Self::Future {
        let req = req.clone();
        Box::pin(async move {
            let pool = req.app_data::<web::Data<Pool>>().unwrap().clone();
            let dataset_header =
                req.headers()
                    .get("AF-Dataset")
                    .ok_or(ServiceError::BadRequest(
                        "Dataset must be specified".to_string(),
                    ))?;

            let dataset_id = dataset_header
                .to_str()
                .map_err(|_| ServiceError::BadRequest("Dataset must be valid string".to_string()))?
                .parse::<uuid::Uuid>()
                .map_err(|_| ServiceError::BadRequest("Dataset must be valid UUID".to_string()))?;

            let dataset = get_dataset_by_id_query(dataset_id, pool).await?;

            let ext = req.extensions();
            let user = ext.get::<LoggedUser>().ok_or(ServiceError::Forbidden)?;
            if dataset.organization_id != user.organization_id {
                return Err(ServiceError::Forbidden);
            }

            Ok::<Dataset, ServiceError>(dataset)
        })
    }
}

#[derive(Serialize, Deserialize, Debug, ToSchema, Clone)]
pub struct CreateDatasetRequest {
    pub dataset_name: String,
}

#[utoipa::path(
    post,
    path = "/dataset",
    context_path = "/api",
    tag = "dataset",
    request_body(content = CreateDatasetRequest, description = "JSON request payload to create a new dataset", content_type = "application/json"),
    responses(
        (status = 200, description = "Dataset created successfully", body = [Dataset]),
        (status = 400, description = "Service error relating to creating the dataset", body = [DefaultError]),
    ),
)]
pub async fn create_dataset(
    data: web::Json<CreateDatasetRequest>,
    pool: web::Data<Pool>,
    user: LoggedUser,
) -> Result<HttpResponse, ServiceError> {
    let admin_email = std::env::var("ADMIN_USER_EMAIL").unwrap_or("".to_string());
    if admin_email != user.email {
        return Err(ServiceError::Forbidden);
    }

    let dataset = Dataset::from_details(data.dataset_name.clone(), user.organization_id);

    let d = create_dataset_query(dataset, pool).await?;
    Ok(HttpResponse::Ok().json(d))
}

#[derive(Serialize, Deserialize, Debug, ToSchema, Clone)]
pub struct UpdateDatasetRequest {
    pub dataset_id: uuid::Uuid,
    pub dataset_name: String,
}

#[utoipa::path(
    put,
    path = "/dataset",
    context_path = "/api",
    tag = "dataset",
    request_body(content = UpdateDatasetRequest, description = "JSON request payload to update a dataset", content_type = "application/json"),
    responses(
        (status = 200, description = "Dataset updated successfully", body = [Dataset]),
        (status = 400, description = "Service error relating to updating the dataset", body = [DefaultError]),
    ),
)]
pub async fn update_dataset(
    data: web::Json<UpdateDatasetRequest>,
    pool: web::Data<Pool>,
    user: LoggedUser,
) -> Result<HttpResponse, ServiceError> {
    let admin_email = std::env::var("ADMIN_USER_EMAIL").unwrap_or("".to_string());
    if admin_email != user.email {
        return Err(ServiceError::Forbidden);
    }

    let d = update_dataset_query(data.dataset_id, data.dataset_name.clone(), pool).await?;
    Ok(HttpResponse::Ok().json(d))
}

#[derive(Serialize, Deserialize, Debug, ToSchema, Clone)]
pub struct DeleteDatasetRequest {
    pub dataset_id: uuid::Uuid,
}

#[utoipa::path(
    delete,
    path = "/dataset",
    context_path = "/api",
    tag = "dataset",
    request_body(content = DeleteDatasetRequest, description = "JSON request payload to delete a dataset", content_type = "application/json"),
    responses(
        (status = 204, description = "Dataset deleted successfully"),
        (status = 400, description = "Service error relating to deleting the dataset", body = [DefaultError]),
    ),
)]
pub async fn delete_dataset(
    data: web::Json<DeleteDatasetRequest>,
    pool: web::Data<Pool>,
    user: LoggedUser,
) -> Result<HttpResponse, ServiceError> {
    let admin_email = std::env::var("ADMIN_USER_EMAIL").unwrap_or("".to_string());
    if admin_email != user.email {
        return Err(ServiceError::Forbidden);
    }

    delete_dataset_by_id_query(data.dataset_id, pool).await?;
    Ok(HttpResponse::NoContent().finish())
}

#[utoipa::path(
    get,
    path = "/dataset",
    context_path = "/api",
    tag = "dataset",
    request_body(content = GetDatasetRequest, description = "JSON request payload to get a dataset", content_type = "application/json"),
    responses(
        (status = 200, description = "Dataset retrieved successfully", body = [Dataset]),
        (status = 400, description = "Service error relating to retrieving the dataset", body = [DefaultError]),
    ),
)]

pub async fn get_dataset(
    pool: web::Data<Pool>,
    dataset_id: web::Path<uuid::Uuid>,
) -> Result<HttpResponse, ServiceError> {
    let d = get_dataset_by_id_query(dataset_id.into_inner(), pool).await?;
    Ok(HttpResponse::Ok().json(d))
}
