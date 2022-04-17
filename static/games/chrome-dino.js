// This is intended to be a "game" for replchat! Made using kaboom, it's a replica of the chrome dinosaur game.
(function() {
  const k = kaboom({
    canvas: document.getElementById('game'),
    height: 250,
    width: 480,
    background: [0, 0, 0],
    global: false,
  })
  k.loadRoot('/games/assets')
  k.loadSprite('ground', '/ground.png')
  k.loadSprite('dino-run', '/dino-run.png', {
    splitX: 4,
    splitY: 1,
    anims: {
      run: {
        from: 0,
        to: 3,
        loop: true
      }
    }
  })
  k.add([
    k.sprite('ground'),
    k.pos(0, k.height()),
    k.origin('botleft'),
    k.area({ scale: 0.5 }),
    k.solid(), 
  ])
  const dino = k.add([
    k.sprite('dino-run', { anim: 'run' }),
    k.pos(20, 80),
    k.area(),
    k.solid(),
    k.body(),
  ])

})();