pipeline {
  agent any

  stages {
    stage('Build Backend') {
      steps {
        sh 'docker build -t spotify-backend ./backend'
      }
    }
    stage('Build Frontend') {
      steps {
        sh 'docker build -t spotify-frontend ./frontend'
      }
    }
    stage('Push to Registry') {
      steps {
        // add your Docker Hub login
        sh 'docker tag spotify-backend yourhub/spotify-backend'
        sh 'docker push yourhub/spotify-backend'
        sh 'docker tag spotify-frontend yourhub/spotify-frontend'
        sh 'docker push yourhub/spotify-frontend'
      }
    }
    stage('Deploy with Kubernetes') {
      steps {
        sh 'kubectl apply -f k8s'
      }
    }
  }
}
