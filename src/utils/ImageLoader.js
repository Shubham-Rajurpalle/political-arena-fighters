// Character Image Manager
// Place your character images in public/assets/images/characters/

export const CHARACTER_IMAGES = {
  modi: {
    portrait: 'assets/images/characters/modi-portrait.png',
    // background: 'assets/images/characters/modi-bg.jpg',
    // sprite: 'assets/images/characters/modi-sprite.png'
  },
  rahul: {
    portrait: 'assets/images/characters/rahul-portrait.png',
    // background: 'assets/images/characters/rahul-bg.jpg',
    // sprite: 'assets/images/characters/rahul-sprite.png'
  }
};

export const STAGE_BACKGROUNDS = {
  parliament: 'assets/images/stages/parliament.jpg',
  rally: 'assets/images/stages/rally.jpg',
  debate: 'assets/images/stages/debate-stage.jpg',
  default: 'assets/images/stages/indian-flag.jpg'
};

export function loadCharacterAssets(scene) {
  // Load character portraits
  Object.keys(CHARACTER_IMAGES).forEach(charId => {
    const images = CHARACTER_IMAGES[charId];

    // Try to load, but don't fail if image doesn't exist
    try {
      if (images.portrait) {
        scene.load.image(`${charId}-portrait`, images.portrait);
      }
      if (images.background) {
        scene.load.image(`${charId}-bg`, images.background);
      }
      if (images.sprite) {
        scene.load.image(`${charId}-sprite`, images.sprite);
      }
    } catch (e) {
      console.log(`Optional image not loaded for ${charId}`);
    }
  });

  // Load stage backgrounds
  Object.keys(STAGE_BACKGROUNDS).forEach(stageId => {
    try {
      scene.load.image(`stage-${stageId}`, STAGE_BACKGROUNDS[stageId]);
    } catch (e) {
      console.log(`Optional stage image not loaded for ${stageId}`);
    }
  });
}

export function hasImage(scene, key) {
  return scene.textures.exists(key);
}
