const endpoints = {
  interactive_translate: "/interactive-translation",
  interactive_translate_v1: "/v1/interactive-translation",
  fetchlanguage: "/fetch-languages",
  fetchmodel: "/aai4b-nmt-inference/v3/fetch-models",
  forgotpassword: "/anuvaad/user-mgmt/v1/users/forgot-password",
  fetchducuments: '/anuvaad-etl/wf-manager/v1/workflow/jobs/search/bulk',
  // insertSentence: "/v1/interactive-editor/add-sentence-node",
  activate_user: "/anuvaad/user-mgmt/v1/users/verify-user",
  adduser: "/create-user",
  auto_ml: "/translate",
  fetch_filedeatils: "/api/v0/serve-file?",
  workflowAsync: "/anuvaad-etl/wf-manager/v1/workflow/async/initiate",
  workflowSync: "/anuvaad-etl/wf-manager/v1/workflow/sync/initiate",
  signup: "/anuvaad/user-mgmt/v1/users/create",
  login: "/anuvaad/user-mgmt/v1/users/login",
  setpassword: "/anuvaad/user-mgmt/v1/users/reset-password",
  userdetails: "/anuvaad/user-mgmt/v1/users/search",
  createuser: "/anuvaad/user-mgmt/v1/users/onboard-users",
  updatePassword: '/anuvaad/user-mgmt/v1/users/reset-password',
  fecthcontent: "/anuvaad/content-handler/v0/fetch-content",
  documentupload: "/anuvaad-api/file-uploader/v0/upload-file",
  documentConverter: "/anuvaad-etl/document-converter/v0/document-converter",
  update_granular_status: "/anuvaad-etl/wf-manager/v1/workflow/setGranularity",
  word_dictionary: "/anuvaad/content-handler/v0/dictionary/search",
  save_content: "/anuvaad/content-handler/v0/save-content-sentence",
  translate: "/anuvaad-etl/translator/v1/text/translate",
  instant_translate: "/aai4b-nmt-inference/v1/translate",
  mark_inactive: "/anuvaad-etl/wf-manager/v1/workflow/jobs/mark-inactive",
  jobids: "/anuvaad/content-handler/v0/records/search",
  profile_details: '/anuvaad/user-mgmt/v1/users/auth-token-search',
  deactivate_existing_user: "/anuvaad/user-mgmt/v1/users/deactivate-user",
  activate_deactivate_user: "/anuvaad/user-mgmt/v1/users/activate-user",
  download_file: '/anuvaad-api/file-uploader/v0/download-file',
  download_zip_file: '/anuvaad-api/file-uploader/v0/serve-file',
  download_json: '/anuvaad/ocr-content-handler/v0/ocr/fetch-document',
  tmx_upload: '/anuvaad-etl/translator/v1/tmx/bulk/create/xls-upload',
  add_org: '/anuvaad/user-mgmt/v1/org/upsert',
  fetch_organization: '/anuvaad/user-mgmt/v1/org/search',
  create_glossary: '/anuvaad-etl/translator/v1/tmx/create',
  accept_glossary_suggestion: '/anuvaad-etl/translator/v1/suggested-tmx/create',
  delete_glossary_suggestion: '/anuvaad-etl/translator/v1/suggested-tmx/delete',
  suggest_glossary: '/anuvaad-etl/translator/v1/suggested-tmx/create',
  update_word: '/anuvaad/ocr-content-handler/v0/ocr/update-word',
  job_detail: "/anuvaad-annotation/sentence-annotation/v0/annotation-type/task/search",
  task_detail: "/anuvaad-annotation/sentence-annotation/v0/task/details/search",
  update_user: "/anuvaad/user-mgmt/v1/users/update",
  user_job: "/anuvaad-annotation/sentence-annotation/v0/user/task/search",
  grade_sentence: "/anuvaad-annotation/sentence-annotation/v0/task/annotation/grading",
  downlod_digitized_file: "/anuvaad-etl/document-converter/v0/document-exporter",
  view_user_glossary: "/anuvaad-etl/translator/v1/tmx/get-all-keys",
  fetch_glossary_suggestions: "/anuvaad-etl/translator/v1/suggested-tmx/get",
  update_suggestion_status: "/anuvaad-etl/translator/v1/suggested-tmx/update",
  delete_user_glossary: "/anuvaad-etl/translator/v1/tmx/delete",
  getUserReport: '/dashboard/getUserReport',
  downloadDocxFile: '/anuvaad-etl/anuvaad-docx-downloader/v0/download-docx',
  downloadOcrDocxFile: '/anuvaad-etl/anuvaad-docx-downloader/ocr/v0/download-docx',
  fetchDigitalDocLink: '/anuvaad/content-handler/v0/ref-link/fetch',
  getTranslatedAndVerifiedSetenceCount: "/anuvaad-metrics/anuvaad-data/verified_count",
  getLangCount: "/anuvaad-metrics/anuvaad-data/lang_count",
  getDocumentCountPerOrg: "/anuvaad-metrics/anuvaad-data/doc_count",
  getAllSupportedLangList: "/anuvaad-metrics/anuvaad-data/languages",
  hostedInference: "/ulca/apis/v0/model/compute",
  getTransliterationModelId:"/ulca/apis/v0/model/getTransliterationModelId",

};

export default endpoints;
