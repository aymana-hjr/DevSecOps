pipeline {

    // "agent any" = Jenkins utilise n'importe quel agent (machine) disponible pour lancer le pipeline
    agent any

    // "tools" = outils installés dans Jenkins (Jenkins > Manage Jenkins > Global Tool Configuration)
    tools {
        maven 'Maven3'  // Le nom 'Maven3' doit correspondre exactement à ce que tu as configuré dans Jenkins
    }

    // "environment" = variables globales utilisables dans tout le pipeline avec ${NOM_VARIABLE}
    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    // ============================================================
    // STAGES = les étapes du pipeline, exécutées dans l'ordre
    // ============================================================
    stages {

        // -------------------------------------------------------
        // ÉTAPE 1 : Récupérer le code depuis GitHub
        // -------------------------------------------------------
        stage('Checkout') {
            steps {
                echo "📥 Clonage du dépôt depuis GitHub..."
                checkout scm   // scm = Source Control Management (lit la config du job Jenkins)
            }
        }

        // -------------------------------------------------------
        // ÉTAPE 2 : Compiler le backend Spring Boot
        // -------------------------------------------------------
        stage('Build Backend') {
            steps {
                echo "🔨 Compilation du backend Spring Boot..."
                dir('Backend') {                             // "dir" = se déplacer dans le dossier Backend
                    sh 'mvn clean package -DskipTests -B'
                    // clean       = supprime le dossier target/ avant de recompiler
                    // package     = compile + crée le fichier .jar
                    // -DskipTests = ne lance PAS les tests ici (on les fait dans l'étape suivante)
                    // -B          = mode batch (pas d'output interactif, meilleur pour Jenkins)
                }
            }
        }

        // -------------------------------------------------------
        // ÉTAPE 3 : Lancer les tests unitaires
        // -------------------------------------------------------
        stage('Tests') {
            steps {
                echo "🧪 Lancement des tests..."
                dir('Backend') {
                    sh 'mvn test -B'
                    // mvn test = exécute tous les tests dans src/test/
                    // Les résultats sont générés dans target/surefire-reports/
                }
            }
            post {
                // "post always" = s'exécute TOUJOURS après ce stage, même en cas d'échec
                always {
                    junit testResults: 'Backend/target/surefire-reports/*.xml', allowEmptyResults: true
                    // junit = plugin Jenkins qui affiche les résultats de tests dans l'interface web
                    // allowEmptyResults = ne bloque pas si aucun rapport n'est trouvé
                }
            }
        }

        // -------------------------------------------------------
        // ÉTAPE 4 : Construire les images Docker
        // -------------------------------------------------------
        stage('Build Docker Images') {
            steps {
                echo "🐳 Construction des images Docker..."
                sh '''
                    # Vérifie si docker est disponible avant de l'utiliser
                    if ! command -v docker &> /dev/null; then
                        echo "⚠️  Docker n'est pas accessible depuis Jenkins."
                        echo "   Solution : monte /var/run/docker.sock dans le conteneur Jenkins."
                        exit 1
                    fi
                    docker compose -f docker-compose.yml build
                '''
                // docker compose build = lit le docker-compose.yml et build toutes les images
            }
        }

        // -------------------------------------------------------
        // ÉTAPE 5 : Déployer l'application
        // -------------------------------------------------------
        stage('Deploy') {
            steps {
                echo "🚀 Déploiement de l'application..."
                sh '''
                    docker compose -f docker-compose.yml up -d
                    # up -d = lance tous les conteneurs en arrière-plan (detached mode)
                '''
            }
        }

    } // fin des stages

    // ============================================================
    // POST = actions exécutées après TOUS les stages
    // ============================================================
    post {

        success {
            // S'exécute uniquement si TOUT le pipeline a réussi
            echo "✅ Pipeline terminé avec succès !"
        }

        failure {
            // S'exécute uniquement si un stage a échoué
            echo "❌ Le pipeline a échoué. Vérifie les logs ci-dessus."
        }

    }

}
