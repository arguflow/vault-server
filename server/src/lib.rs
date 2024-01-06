#![feature(ready_into_inner)]
#[macro_use]
extern crate diesel;

use crate::{
    handlers::auth_handler::build_oidc_client,
    operators::{
        model_operator::initalize_cross_encoder,
        qdrant_operator::create_new_qdrant_collection_query,
    },
};
use actix_cors::Cors;
use actix_identity::IdentityMiddleware;
use actix_session::{config::PersistentSession, storage::RedisSessionStore, SessionMiddleware};
use actix_web::{
    cookie::{Key, SameSite},
    middleware,
    web::{self, PayloadConfig},
    App, HttpServer,
};
use diesel::{prelude::*, r2d2};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use utoipa::OpenApi;
use utoipa_redoc::{Redoc, Servable};

mod data;
mod errors;
mod handlers;
mod operators;
mod randutil;
mod af_middleware;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");
pub const SECONDS_IN_MINUTE: u64 = 60;
pub const SECONDS_IN_HOUR: u64 = 60 * SECONDS_IN_MINUTE;
pub const SECONDS_IN_DAY: u64 = 24 * SECONDS_IN_HOUR;

fn run_migrations(conn: &mut impl MigrationHarness<diesel::pg::Pg>) {
    conn.run_pending_migrations(MIGRATIONS).unwrap();
}

#[macro_export]
#[cfg(not(feature = "runtime-env"))]
macro_rules! get_env {
    ($name:expr, $message:expr) => {
        env!($name, $message)
    };
}

#[macro_export]
#[cfg(feature = "runtime-env")]
macro_rules! get_env {
    ($name:expr, $message:expr) => {{
        lazy_static::lazy_static! {
            static ref ENV_VAR: String = {
                std::env::var($name).expect($message)
            };
        }
        ENV_VAR.as_str()
    }};
}

#[actix_web::main]
pub async fn main() -> std::io::Result<()> {
    #[derive(OpenApi)]
    #[openapi(
        info(description = "Arguflow REST API OpenAPI Documentation"),
        paths(
            handlers::auth_handler::login,
            handlers::auth_handler::logout,
            handlers::auth_handler::get_me,
            handlers::topic_handler::create_topic,
            handlers::topic_handler::delete_topic,
            handlers::topic_handler::update_topic,
            handlers::topic_handler::get_all_topics,
            handlers::message_handler::create_message_completion_handler,
            handlers::message_handler::get_all_topic_messages,
            handlers::message_handler::edit_message_handler,
            handlers::message_handler::regenerate_message_handler,
            handlers::chunk_handler::create_chunk,
            handlers::chunk_handler::update_chunk,
            handlers::chunk_handler::delete_chunk,
            handlers::chunk_handler::get_recommended_chunks,
            handlers::message_handler::create_suggested_queries_handler,
            handlers::chunk_handler::update_chunk_by_tracking_id,
            handlers::chunk_handler::search_chunk,
            handlers::chunk_handler::generate_off_chunks,
            handlers::chunk_handler::get_chunk_by_tracking_id,
            handlers::chunk_handler::delete_chunk_by_tracking_id,
            handlers::chunk_handler::get_chunk_by_id,
            handlers::user_handler::update_user,
            handlers::user_handler::set_user_api_key,
            handlers::user_handler::get_user_with_chunks_by_id,
            handlers::file_handler::get_user_files_handler,
            handlers::collection_handler::get_specific_user_chunk_collections,
            handlers::collection_handler::create_chunk_collection,
            handlers::collection_handler::delete_chunk_collection,
            handlers::collection_handler::update_chunk_collection,
            handlers::collection_handler::add_bookmark,
            handlers::collection_handler::delete_bookmark,
            handlers::collection_handler::get_logged_in_user_chunk_collections,
            handlers::collection_handler::get_all_bookmarks,
            handlers::file_handler::upload_file_handler,
            handlers::file_handler::get_file_handler,
            handlers::file_handler::delete_file_handler,
            handlers::file_handler::get_image_file,
            handlers::notification_handler::mark_notification_as_read,
            handlers::notification_handler::get_notifications,
            handlers::notification_handler::mark_all_notifications_as_read,
            handlers::auth_handler::health_check,
            handlers::organization_handler::get_organization_by_id,
            handlers::organization_handler::update_organization,
            handlers::organization_handler::create_organization,
            handlers::dataset_handler::create_dataset,
            handlers::dataset_handler::update_dataset,
            handlers::dataset_handler::delete_dataset,
            handlers::dataset_handler::get_dataset,
            handlers::dataset_handler::get_datasets_from_organization,
            handlers::dataset_handler::get_client_dataset_config,
            handlers::stripe_handler::direct_to_payment_link,
            handlers::stripe_handler::cancel_subscription,
            handlers::stripe_handler::update_subscription_plan,
            handlers::stripe_handler::get_all_plans,
        ),
        components(
            schemas(
                handlers::auth_handler::AuthData,
                handlers::topic_handler::CreateTopicData,
                handlers::topic_handler::DeleteTopicData,
                handlers::topic_handler::UpdateTopicData,
                handlers::message_handler::CreateMessageData,
                handlers::message_handler::RegenerateMessageData,
                handlers::message_handler::EditMessageData,
                handlers::message_handler::SuggestedQueriesRequest,
                handlers::message_handler::SuggestedQueriesResponse,
                handlers::chunk_handler::CreateChunkData,
                handlers::chunk_handler::ReturnCreatedChunk,
                handlers::chunk_handler::UpdateChunkData,
                handlers::chunk_handler::RecommendChunksRequest,
                handlers::chunk_handler::UpdateChunkByTrackingIdData,
                handlers::chunk_handler::SearchChunkQueryResponseBody,
                handlers::chunk_handler::GenerateChunksRequest,
                handlers::chunk_handler::SearchChunkData,
                handlers::chunk_handler::ScoreChunkDTO,
                handlers::chunk_handler::SearchCollectionsData,
                handlers::chunk_handler::SearchCollectionsResult,
                handlers::user_handler::UpdateUserData,
                handlers::user_handler::GetUserWithChunksData,
                handlers::user_handler::SetUserApiKeyResponse,
                handlers::collection_handler::CollectionData,
                handlers::collection_handler::UserCollectionQuery,
                handlers::collection_handler::CreateChunkCollectionData,
                handlers::collection_handler::DeleteCollectionData,
                handlers::collection_handler::UpdateChunkCollectionData,
                handlers::collection_handler::AddChunkToCollectionData,
                handlers::collection_handler::GetCollectionsForChunksData,
                handlers::collection_handler::RemoveBookmarkData,
                handlers::collection_handler::GenerateOffCollectionData,
                handlers::collection_handler::GetAllBookmarksData,
                handlers::collection_handler::BookmarkChunks,
                handlers::collection_handler::BookmarkData,
                operators::collection_operator::BookmarkCollectionResult,
                handlers::file_handler::UploadFileData,
                handlers::file_handler::UploadFileResult,
                handlers::notification_handler::NotificationId,
                handlers::notification_handler::Notification,
                handlers::organization_handler::CreateOrganizationData,
                handlers::organization_handler::UpdateOrganizationData,
                operators::notification_operator::NotificationReturn,
                handlers::dataset_handler::CreateDatasetRequest,
                handlers::dataset_handler::UpdateDatasetRequest,
                handlers::dataset_handler::DeleteDatasetRequest,
                handlers::stripe_handler::GetDirectPaymentLinkData,
                handlers::stripe_handler::UpdateSubscriptionData,
                data::models::SlimUser,
                data::models::UserDTO,
                data::models::Topic,
                data::models::Message,
                data::models::ChunkMetadata,
                data::models::ChunkMetadataWithFileData,
                data::models::ChatMessageProxy,
                data::models::UserDTOWithChunks,
                data::models::File,
                data::models::ChunkCollection,
                data::models::ChunkCollectionAndFile,
                data::models::FileDTO,
                data::models::FileUploadCompletedNotificationWithName,
                data::models::Organization,
                data::models::Dataset,
                data::models::UserRole,
                data::models::DatasetAndOrgWithSubAndPlan,
                data::models::ClientDatasetConfiguration,
                data::models::StripePlan,
                errors::DefaultError,
            )
        ),
        tags(
            (name = "auth", description = "Authentication endpoint"),
            (name = "topic", description = "Topic chat endpoint"),
            (name = "message", description = "Message chat endpoint"),
            (name = "chunk", description = "chunk endpoint"),
            (name = "user", description = "User endpoint"),
            (name = "chunk_collection", description = "chunk collection endpoint"),
            (name = "file", description = "File endpoint"),
            (name = "notifications", description = "Notifications endpoint"),
            (name = "health", description = "Health check endpoint"),
            (name = "organization", description = "Organization endpoint"),
            (name = "dataset", description = "Dataset endpoint"),
            (name = "stripe", description = "Stripe endpoint"),
        )
    )]
    struct ApiDoc;

    dotenvy::dotenv().ok();

    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    if std::env::var("ALERT_EMAIL").is_err() {
        log::warn!("ALERT_EMAIL not set, this might be useful during health checks");
    }

    let database_url = get_env!("DATABASE_URL", "DATABASE_URL should be set");
    let redis_url = get_env!("REDIS_URL", "REDIS_URL should be set");

    // create db connection pool
    let manager = r2d2::ConnectionManager::<PgConnection>::new(database_url);
    let pool: data::models::Pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");

    let cross_encoder = web::Data::new(initalize_cross_encoder());

    let redis_store = RedisSessionStore::new(redis_url).await.unwrap();

    let oidc_client = build_oidc_client().await;
    run_migrations(&mut pool.get().unwrap());

    let _ = create_new_qdrant_collection_query().await.map_err(|err| {
        log::error!("Failed to create qdrant collection: {:?}", err);
    });

    HttpServer::new(move || {
        App::new()
            .app_data(PayloadConfig::new(134200000))
            .app_data( web::JsonConfig::default().limit(134200000))
            .app_data(web::Data::new(pool.clone()))
            .app_data(web::Data::new(oidc_client.clone()))
            .wrap(af_middleware::auth_middleware::AuthMiddlewareFactory)
            .wrap(
                IdentityMiddleware::builder()
                    .login_deadline(Some(std::time::Duration::from_secs(SECONDS_IN_DAY)))
                    .visit_deadline(Some(std::time::Duration::from_secs(SECONDS_IN_DAY)))
                    .build(),
            )
            .wrap(Cors::permissive())
            .wrap(
                SessionMiddleware::builder(
                    redis_store.clone(),
                    Key::from(operators::user_operator::SECRET_KEY.as_bytes()),
                )
                .session_lifecycle(
                    PersistentSession::default().session_ttl(time::Duration::days(1)),
                )
                .cookie_name("vault".to_owned())
                .cookie_same_site(if std::env::var("COOKIE_SECURE").unwrap_or("false".to_owned()) == "true" {
                    SameSite::None
                } else {
                    SameSite::Lax
                })
                .cookie_secure(std::env::var("COOKIE_SECURE").unwrap_or("false".to_owned()) == "true")
                .cookie_path("/".to_owned())
                .build(),
            )
            // enable logger
            .wrap(middleware::Logger::default())
            .service(Redoc::with_url("/redoc", ApiDoc::openapi()))
            // everything under '/api/' route
            .service(
                web::scope("/api")
                    .service(
                        web::scope("/dataset")
                            .service(
                                web::resource("")
                                    .route(web::post().to(handlers::dataset_handler::create_dataset))
                                    .route(web::put().to(handlers::dataset_handler::update_dataset))
                                    .route(web::delete().to(handlers::dataset_handler::delete_dataset))
                            )
                            .service(
                                web::resource("/organization/{organization_id}")
                                    .route(web::get().to(handlers::dataset_handler::get_datasets_from_organization)),
                            ).service(
                                web::resource("/envs").route(web::get().to(handlers::dataset_handler::get_client_dataset_config))
                            ).service(
                                web::resource("/{dataset_id}")
                                    .route(web::get().to(handlers::dataset_handler::get_dataset)),
                            )
                    )
                    
                    .service(
                        web::scope("/auth")
                        .service(
                        web::resource("")
                            .route(web::get().to(handlers::auth_handler::login))
                            .route(web::delete().to(handlers::auth_handler::logout))
                        )
                        .service(
                            web::resource("/me")
                                .route(web::get().to(handlers::auth_handler::get_me)),
                        )
                        .service(
                            web::resource("/callback")
                                .route(web::get().to(handlers::auth_handler::callback)),
                        )
                    )
                    .service(
                        web::resource("/topic")
                            .route(web::post().to(handlers::topic_handler::create_topic))
                            .route(web::delete().to(handlers::topic_handler::delete_topic))
                            .route(web::put().to(handlers::topic_handler::update_topic))
                            .route(web::get().to(handlers::topic_handler::get_all_topics)),
                    )
                    .service(
                        web::resource("/message")
                            .route(
                                web::post().to(
                                    handlers::message_handler::create_message_completion_handler,
                                ),
                            )
                            .route(web::put().to(handlers::message_handler::edit_message_handler))
                            .route(
                                web::delete()
                                    .to(handlers::message_handler::regenerate_message_handler),
                            ),
                    )
                    .service(
                        web::resource("/messages/{messages_topic_id}").route(
                            web::get().to(handlers::message_handler::get_all_topic_messages),
                        ),
                    )
                    .service(
                        web::scope("/chunk")
                            .service(
                                web::resource("")
                                    .route(web::post().to(handlers::chunk_handler::create_chunk)),
                            )
                            .service(
                                web::resource("/recommend").route(
                                    web::post().to(handlers::chunk_handler::get_recommended_chunks),
                                ),
                            )
                            .service(
                                web::resource("/update")
                                    .route(web::put().to(handlers::chunk_handler::update_chunk)),
                            )
                            .service(
                                web::resource("/search")
                                    .route(web::post().to(handlers::chunk_handler::search_chunk)),
                            )
                            .service(
                                web::resource("/gen_suggestions")
                                    .route(web::post().to(handlers::message_handler::create_suggested_queries_handler)),
                            )
                            .service(
                                web::resource("/search/{page}")
                                    .app_data(cross_encoder.clone())
                                    .route(web::post().to(handlers::chunk_handler::search_chunk)),
                            )
                            .service(
                                web::resource("/generate")
                                .route(web::post().to(handlers::chunk_handler::generate_off_chunks)),
                            )
                            .service(
                                web::resource("/tracking_id/update")
                                    .route(web::put().to(handlers::chunk_handler::update_chunk_by_tracking_id)),
                            )
                            .service(
                                web::resource("/tracking_id/{tracking_id}")
                                    .route(web::get().to(handlers::chunk_handler::get_chunk_by_tracking_id))
                                    .route(web::delete().to(handlers::chunk_handler::delete_chunk_by_tracking_id))
                            )
                            .service(
                                web::resource("/{chunk_id}")
                                    .route(web::get().to(handlers::chunk_handler::get_chunk_by_id))
                                    .route(web::delete().to(handlers::chunk_handler::delete_chunk)),
                            )
                    ).service(
                        web::scope("/user")
                            .service(web::resource("")
                                .route(web::put().to(handlers::user_handler::update_user)),
                            )
                            .service(web::resource("/set_api_key")
                                .route(web::get().to(handlers::user_handler::set_user_api_key)),
                            )
                            .service(
                                web::resource("/files/{user_id}")
                                    .route(web::get().to(handlers::file_handler::get_user_files_handler)),
                            )
                            .service(web::resource("/{user_id}/{page}")
                                .route(web::get().to(handlers::user_handler::get_user_with_chunks_by_id)),
                            )
                            .service(
                                web::resource("/collections/{user_id}/{page}").route(
                                    web::get().to(
                                        handlers::collection_handler::get_specific_user_chunk_collections,
                                    ),
                                ),
                            ),
                    )
                    .service(
                        web::scope("/chunk_collection")
                            .service(
                                web::resource("")
                                    .route(
                                        web::post().to(
                                            handlers::collection_handler::create_chunk_collection,
                                        ),
                                    )
                                    .route(
                                        web::delete().to(
                                            handlers::collection_handler::delete_chunk_collection,
                                        ),
                                    )
                                    .route(
                                        web::put().to(
                                            handlers::collection_handler::update_chunk_collection,
                                        ),
                                    ),
                            )
                            .service(
                                web::resource("/bookmark").route(
                                    web::post().to(
                                        handlers::collection_handler::get_collections_chunk_is_in,
                                    ),
                                ),
                            )
                            .service(
                                web::resource("/{page_or_chunk_collection_id}")
                                    .route(
                                        web::post().to(handlers::collection_handler::add_bookmark),
                                    )
                                    .route(
                                        web::delete()
                                            .to(handlers::collection_handler::delete_bookmark),
                                    ).route(
                                        web::get()
                                            .to(handlers::collection_handler::get_logged_in_user_chunk_collections)),
                            )
                            .service(
                                web::resource("/search/{page}")                                    
                                .route(
                                    web::post().to(handlers::chunk_handler::search_collections),
                                ),
                            )
                            .service(web::resource("/{collection_id}/{page}").route(
                                web::get().to(handlers::collection_handler::get_all_bookmarks),
                            )),
                    )
                    .service(
                        web::scope("/file")
                            .service(
                                web::resource("")
                                    .route(web::post().to(handlers::file_handler::upload_file_handler)),
                            )
                            .service(
                                web::resource("/{file_id}")
                                    .route(web::get().to(handlers::file_handler::get_file_handler))
                                    .route(web::delete().to(handlers::file_handler::delete_file_handler)),
                            ),
                    )
                    .service(
                        web::resource("/image/{file_name}").route(
                            web::get().to(handlers::file_handler::get_image_file),
                        ),
                    )
                    .service(
                        web::resource("/pdf_from_range/{file_start}/{file_end}/{prefix}/{file_name}/{ocr}").route(
                            web::get().to(handlers::file_handler::get_pdf_from_range),
                        ),
                    )
                    .service(
                        web::scope("/notifications")
                            .service(web::resource("").route(
                                web::put().to(handlers::notification_handler::mark_notification_as_read),
                            ))
                            .service(
                                web::resource("/{page}").route(
                                    web::get().to(handlers::notification_handler::get_notifications),
                                ),
                            ),
                    )
                    .service(
                        web::resource("/notifications_readall")
                            .route(web::put().to(
                                handlers::notification_handler::mark_all_notifications_as_read,
                            )),
                    )
                    .service(
                        web::resource("/health").route(web::get().to(handlers::auth_handler::health_check)),
                    )
                    .service(
                        web::scope("/organization")
                        .service(
                            web::resource("/{organization_id}")
                                .route(web::get().to(handlers::organization_handler::get_organization_by_id))
                        )
                        .service(
                            web::resource("/usage/{organization_id}")
                                .route(web::get().to(handlers::organization_handler::get_organization_usage))
                        )
                        .service(
                            web::resource("")
                                .route(web::post().to(handlers::organization_handler::create_organization))
                                .route(web::put().to(handlers::organization_handler::update_organization))
                        )
                    )
                    .service(
                        web::scope("/usage")
                            .service(
                                web::resource("/organization/{organization_id}")
                                    .route(web::get().to(handlers::organization_handler::get_organization_usage)),
                            )
                            
                    )
                    .service(
                        web::resource("/invitation")
                            .route(web::post().to(handlers::invitation_handler::post_invitation)),
                    )
                    .service(
                        web::scope("/stripe")
                            .service(
                                web::resource("/webhook")
                                    .route(web::post().to(handlers::stripe_handler::webhook)),
                            )
                            .service(
                                web::resource("/subscription/{subscription_id}")
                                    .route(web::delete().to(handlers::stripe_handler::cancel_subscription)),
                            )
                            .service(
                                web::resource("/subscription_plan/{subscription_id}/{plan_id}")
                                    .route(web::patch().to(handlers::stripe_handler::update_subscription_plan)),
                            )
                            .service(
                                web::resource("/payment_link/{plan_id}/{organization_id}")
                                    .route(web::get().to(handlers::stripe_handler::direct_to_payment_link)),
                            )
                            .service(
                                web::resource("/plans")
                                    .route(web::get().to(handlers::stripe_handler::get_all_plans)),
                            ),
                    )
            )
    })
    .bind(("0.0.0.0", 8090))?
    .run()
    .await
}
