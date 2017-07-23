pipeline {
  agent {
    docker {
      image 'node:latest'
    }
    
  }
  stages {
    stage('Checkout') {
      steps {
        git(credentialsId: '49ba51f13dec36eb1f09097b6574140eabcb1277', url: 'https://github.com/junior-ales/memory-hang-game.git', branch: 'master')
      }
    }
    stage('Build') {
      steps {
        sh 'node -v'
      }
    }
  }
}