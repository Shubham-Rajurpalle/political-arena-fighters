export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Update loading progress
    this.load.on('progress', (value) => {
      const progressBar = document.getElementById('progress');
      if (progressBar) {
        progressBar.style.width = (value * 100) + '%';
      }
    });
    
    this.load.on('complete', () => {
      const loading = document.getElementById('loading');
      if (loading) {
        loading.style.display = 'none';
      }
    });
    
    // Load data files
    this.load.json('characters', 'src/data/characters.json');
    this.load.json('weapons', 'src/data/weapons.json');
  }

  create() {
    this.scene.start('MainMenuScene');
  }
}
