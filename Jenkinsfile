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
            sh 'curl -fsSL -X POST "$COOLIFY_WEBHOOK_URL"'
          } else {
            // curl est disponible par défaut sur Windows 10+
            bat 'curl -fsSL -X POST "%COOLIFY_WEBHOOK_URL%"'
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


