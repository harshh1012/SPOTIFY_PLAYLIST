pipeline {
  agent any

  environment {
    BACKEND_IMAGE = "harshith1203/spotify-backend"
    FRONTEND_IMAGE = "harshith1203/spotify-frontend"
  }

  stages {

    stage('Checkout') {
            steps {
                git url: 'https://github.com/harshh1012/SPOTIFY_PLAYLIST.git', branch: 'main'
            }
        }
        
    stage('Build Backend') {
      steps {
        sh 'docker build -t $BACKEND_IMAGE ./backend'
      }
    }

    stage('Build Frontend') {
      steps {
        sh 'docker build -t $FRONTEND_IMAGE ./frontend'
      }
    }

    stage('Push Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh """
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push $BACKEND_IMAGE
            docker push $FRONTEND_IMAGE
          """
        }
      }
    }

    stage('Deploy') {
      steps {
        sh 'echo "You could deploy to Kubernetes here"'
      }
    }
  }
}
