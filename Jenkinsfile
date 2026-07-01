pipeline {
    agent any

    tools {
        maven 'Maven3' // Nom configuré dans Jenkins > Global Tool Configuration
    }

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        OWASP_REPORT_DIR    = 'dependency-check-report'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '15'))
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES') // Evite les builds bloqués indéfiniment
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📥 Clonage du dépôt..."
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                echo "🔨 Compilation du backend..."
                dir('Backend') {
                    sh 'mvn clean package -DskipTests -B'
                }
            }
        }

        stage('Unit & Integration Tests') {
            steps {
                echo "🧪 Exécution des tests..."
                dir('Backend') {
                    sh 'mvn test -B'
                }
            }
            post {
                always {
                    // Publie les résultats de tests JUnit même si le stage échoue
                    junit testResults: '**/target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                echo "🔍 Scan des vulnérabilités des dépendances..."
                dependencyCheck additionalArguments: """
                    --scan ./Backend
                    --format HTML
                    --format XML
                    --out ${OWASP_REPORT_DIR}
                    --disableYarnAudit
                    --disableNodeAudit
                """, odcInstallation: 'OWASP-DC' // Nom configuré dans Global Tool Configuration
            }
            post {
                always {
                    dependencyCheckPublisher pattern: "${OWASP_REPORT_DIR}/dependency-check-report.xml"
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "🐳 Construction des images Docker..."
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} build"
            }
        }

        stage('Deploy') {
            when {
                // Déployer uniquement depuis la branche principale
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                echo "🚀 Déploiement..."
                sh "docker compose -f ${DOCKER_COMPOSE_FILE} up -d"
            }
        }
    }

    post {
        always {
            echo "📦 Archivage des rapports..."
            archiveArtifacts artifacts: '**/target/surefire-reports/*.xml', allowEmptyArchive: true
            archiveArtifacts artifacts: "${OWASP_REPORT_DIR}/dependency-check-report.html", allowEmptyArchive: true
        }
        success {
            echo "✅ Pipeline terminé avec succès !"
        }
        failure {
            echo "❌ Le pipeline a échoué. Vérifie les logs ci-dessus."
        }
        unstable {
            echo "⚠️ Pipeline instable (tests en échec ou vulnérabilités détectées)."
        }
    }
}
