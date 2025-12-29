pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  parameters {
    booleanParam(name: 'SKIP_LINT', defaultValue: false, description: 'Ignore npm run lint')
    booleanParam(name: 'SKIP_BUILD', defaultValue: false, description: 'Ignore npm run build')
    booleanParam(name: 'TRIGGER_COOLIFY', defaultValue: true, description: 'Déclencher le redeploy Coolify via webhook')
    booleanParam(name: 'COOLIFY_INSECURE_TLS', defaultValue: false, description: 'Autoriser TLS non valide (self-signed) pour le webhook Coolify')
  }

  environment {
    // À définir dans Jenkins (Credentials / env var):
    // - COOLIFY_WEBHOOK_URL : webhook de déploiement fourni par Coolify (secret)
    // Exemple: https://coolify.example.com/webhooks/deploy/xxxxxxxx
    COOLIFY_WEBHOOK_URL = "${env.COOLIFY_WEBHOOK_URL}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        script {
          if (isUnix()) {
            sh 'node -v && npm -v'
            sh 'npm ci --no-audit --no-fund'
          } else {
            bat 'node -v && npm -v'
            bat 'npm ci --no-audit --no-fund'
          }
        }
      }
    }

    stage('Lint') {
      when { expression { return !params.SKIP_LINT } }
      steps {
        script {
          if (isUnix()) {
            sh 'npm run lint'
          } else {
            bat 'npm run lint'
          }
        }
      }
    }

    stage('Build') {
      when { expression { return !params.SKIP_BUILD } }
      steps {
        script {
          if (isUnix()) {
            sh 'npm run build'
          } else {
            bat 'npm run build'
          }
        }
      }
    }

    stage('Trigger Coolify Deploy') {
      when {
        expression {
          return params.TRIGGER_COOLIFY && env.COOLIFY_WEBHOOK_URL != null && env.COOLIFY_WEBHOOK_URL.trim()
        }
      }
      steps {
        script {
          echo "Trigger Coolify webhook..."
          if (isUnix()) {
            sh '''
              set -e
              CURL_TLS=""
              if [ "${COOLIFY_INSECURE_TLS}" = "true" ]; then
                CURL_TLS="-k"
              fi
              # Diagnostic sans leak d'URL: on affiche seulement l'host
              HOST="$(echo "$COOLIFY_WEBHOOK_URL" | sed -E 's#https?://([^/]+)/?.*#\\1#')"
              echo "Coolify webhook host: ${HOST}"
              # Retry pour éviter les flaps réseau
              curl ${CURL_TLS} -fsSL -X POST \
                --connect-timeout 10 --max-time 30 \
                --retry 3 --retry-delay 2 --retry-connrefused \
                "$COOLIFY_WEBHOOK_URL"
            '''
          } else {
            // curl est disponible par défaut sur Windows 10+
            bat '''
              @echo off
              setlocal enabledelayedexpansion
              set CURL_TLS=
              if /I "%COOLIFY_INSECURE_TLS%"=="true" set CURL_TLS=-k
              rem On évite d'afficher l'URL complète (secret). On affiche juste l'host.
              for /f "tokens=2 delims=/" %%a in ("%COOLIFY_WEBHOOK_URL%") do set HOST=%%a
              echo Coolify webhook host: %HOST%
              curl %CURL_TLS% -fsSL -X POST --connect-timeout 10 --max-time 30 --retry 3 --retry-delay 2 --retry-connrefused "%COOLIFY_WEBHOOK_URL%"
            '''
          }
        }
      }
    }
  }

  post {
    success {
      echo '✅ Pipeline terminé avec succès.'
    }
    failure {
      echo '❌ Pipeline en échec. Vérifie les logs Jenkins.'
    }
  }
}


