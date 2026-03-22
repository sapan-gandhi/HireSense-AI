import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg = error?.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)

export default api

export const authAPI = {
  register:   (data) => api.post('/auth/register', data),
  verify:     (data) => api.post('/auth/verify', data),
  resendCode: (data) => api.post('/auth/resend-code', data),
  login:      (data) => api.post('/auth/login', data),
  me:         ()     => api.get('/auth/me'),
}

export const resumeAPI = {
  upload:  (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  }),
  improve: () => api.post('/resume/improve'),
}

export const analysisAPI = {
  run:    (resumeId) => api.post('/analysis/run', { resumeId }),
  get:    (id)       => api.get(`/analysis/${id}`),
  getAll: ()         => api.get('/analysis/user/all'),
}

export const jdAPI = {
  match: (jdText, analysisId) => api.post('/jd/match', { jdText, analysisId }),
}

export const reportAPI = {
  exportLatest: () => api.get('/report/export/latest', { responseType: 'text', timeout: 60000 }),
  exportById:   (id) => api.get(`/report/export/${id}`, { responseType: 'text', timeout: 60000 }),
}
