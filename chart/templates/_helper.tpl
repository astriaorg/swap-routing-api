{{/*
Define namespace to use
*/}}
{{- define "swapRoutingApi.namespace" -}}
{{- if .Values.global.namespaceOverride -}}
{{- .Values.global.namespaceOverride -}}
{{- else -}}
{{- .Release.Namespace -}}
{{- end -}}
{{- end -}}

{{/*
Common labels
*/}}
{{- define "swapRoutingApi.labels" -}}
app: swap-routing-api
{{- end -}}

{{/*
Service annotations
*/}}
{{- define "swapRoutingApi.serviceAnnotations" -}}
{{- if .Values.service.annotations -}}
{{- toYaml .Values.service.annotations -}}
{{- end -}}
{{- end -}}
