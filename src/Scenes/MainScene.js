    class MainScene extends Phaser.Scene {
        constructor() {
            super("mainScene");

            // Initialize a class variable "my" which is an object.
            // The object has one property, "sprite" which is also an object.
            // This will be used to hold bindings (pointers) to created sprites.
            this.my = {sprite: {}, text: {}};

            // Set movement speeds (in pixels/tick)
            this.playerSpeed = 5;
            this.bulletSpeed = 10;

            this.bulletCooldown = 3;        // Number of update() calls to wait before making a new bullet
            this.bulletCooldownCounter = 0;
            
            //Game management
            this.gameOverShown = false;
            this.myScore = 0; 
        }

        init (data) {
            if (data.reset) {
                this.myScore = 0;
                this.gameOverShown = false;
                this.bulletCooldown = 3;
                this.bulletCooldownCounter = 0;
            }
        }

        preload() {
            this.load.setPath("./assets/");
            this.load.image("elephant", "elephant.png");
            this.load.image("heart", "heart.png");
            this.load.image("hippo", "hippo.png");
            this.load.image("enemyBullet", "enemyBullet.png");
            this.load.image("Scrolling_Starfield", "Scrolling_Starfield.jpg");

            // For animation
            this.load.image("whitePuff00", "whitePuff00.png");
            this.load.image("whitePuff01", "whitePuff01.png");
            this.load.image("whitePuff02", "whitePuff02.png");
            this.load.image("whitePuff03", "whitePuff03.png");

            //font
            this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
        }

        create() {
            let my = this.my;

            // Create key objects
            this.left = this.input.keyboard.addKey("A");
            this.right = this.input.keyboard.addKey("D");
            this.nextScene = this.input.keyboard.addKey("S");
            this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            //Background
            this.starfield = this.add.tileSprite(0, 0, 800, 600, "Scrolling_Starfield").setOrigin(0, 0);

            my.sprite.elephant = new Player(this, game.config.width/2, game.config.height - 40, "elephant", null,
                                            this.left, this.right, 5);
            my.sprite.elephant.setScale(0.125);

            my.sprite.bulletGroup = this.add.group({
                active: true,
                defaultKey: "heart",
                maxSize: 25,
                runChildUpdate: true
                }
            )

            my.sprite.bulletGroup.createMultiple({
                classType: Bullet,
                active: false,
                key: my.sprite.bulletGroup.defaultKey,
                repeat: my.sprite.bulletGroup.maxSize-1
            });
            my.sprite.bulletGroup.propertyValueSet("speed", this.bulletSpeed);

            // update HTML description
            document.getElementById('description').innerHTML = '<h2>Level 1</h2><br>A: left // D: right // Space: fire/emit'
            
            

            // Create white puff animation
            this.anims.create({
                key: "puff",
                frames: [
                    { key: "whitePuff00" },
                    { key: "whitePuff01" },
                    { key: "whitePuff02" },
                    { key: "whitePuff03" },
                ],
                frameRate: 30,    // Note: case sensitive (thank you Ivy!)
                repeat: 2,
                hideOnComplete: true
            });

            //Paths
            this.points1 = [
                100,75,
                700,75,
                700,125,
                100,125,
                100,75,
                700,75,
            ];
            
            this.curve = new Phaser.Curves.Spline(this.points1);

            //Graph visuals
            // // Initialize Phaser graphics, used to draw lines
            // this.graphics = this.add.graphics();

            // // Draw initial graphics
            // this.xImages = [];
            // this.drawPoints();
            // this.drawLine();
            
            // Put score on screen
            my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

            //HP Display
            my.text.hpDisplay = this.add.bitmapText(10, 550, "rocketSquare", "HP: " + this.my.sprite.elephant.hp);

            //Player Input
            //Firing
            this.space.on('down', () => {
                if (this.bulletCooldownCounter < 0) {
                    // Get the first inactive bullet, and make it active
                    let bullet = my.sprite.bulletGroup.getFirstDead();
                    // bullet will be null if there are no inactive (available) bullets
                    if (bullet != null) {
                        this.bulletCooldownCounter = this.bulletCooldown;
                        bullet.makeActive();
                        bullet.x = my.sprite.elephant.x;
                        bullet.y = my.sprite.elephant.y - (my.sprite.elephant.displayHeight/2);
                    }
                }
            });

            //Enemy Bullet Group
            my.sprite.enemyBulletGroup = this.add.group({
                classType: EnemyBullet,
                maxSize: 20,
                runChildUpdate: true
            });
            
            my.sprite.enemyBulletGroup.createMultiple({
                key: "enemyBullet",  // or whatever bullet texture you want
                repeat: 19,
                active: false,
                visible: false,
                setXY: { x: -100, y: -100 }
            });

            //Enemy Group
            my.sprite.enemyGroup = this.add.group({
                classType: Enemy,
                maxSize: 10,
                runChildUpdate: true
            });

            for (let i = 0; i < 2; i++) {
                let enemy = new Enemy(this, this.curve, 100, 50, "hippo");
                enemy.setActive(true);
                enemy.setVisible(true);
                my.sprite.enemyGroup.add(enemy);
            
                enemy.startFollow({
                    from: 0,
                    to: 1,
                    delay: i * 2000,
                    duration: 12000,
                    ease: 'Sine.easeInOut',
                    repeat: -1,
                    yoyo: true,
                    rotateToPath: false,
                    rotationOffset: -90
                });
            }
        }

        update() {
            let my = this.my;
            this.bulletCooldownCounter--;

            // update the player avatar by by calling the elephant's update()
            my.sprite.elephant.update();

            //Background
            this.starfield.tilePositionY -= 1;

            for (let bullet of my.sprite.bulletGroup.getChildren()) {
                if (!bullet.active) continue;
            
                for (let enemy of my.sprite.enemyGroup.getChildren()) {
                    if (!enemy.active) continue;
                    
                    if (this.collides(enemy, bullet)) {
                        // puff animation
                        let puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
                        
                        bullet.setActive(false);
                        bullet.setVisible(false);   
                        bullet.y = -100;
            
                        enemy.AddHP(-1);
            
                        // update score
                        this.myScore += 10;
                        this.updateScore();
            
            
                        break;  
                    }
                }
            }


            //Enemy Bullet Collisions
            for (let bullet of my.sprite.enemyBulletGroup.getChildren()) {
                if (!bullet.active) continue;
                else
                {
                    if (this.collides(my.sprite.elephant, bullet)) {
                        // puff animation
                        let puff = this.add.sprite(my.sprite.elephant.x, my.sprite.elephant.y, "whitePuff03").setScale(0.25).play("puff");
                        
                        bullet.setActive(false);
                        bullet.setVisible(false);   
                        bullet.y = -100;
            
                        my.sprite.elephant.AddHP(-1);
                        //Update HP
                        this.updateHPDisplay();

                        // update score
                        this.myScore -= 300;
                        this.updateScore();
            
                        break;
                    }
                }
            }


            //Game Over
            // Check if all enemies are dead
            if (!this.gameOverShown) {
                let allDead = true;
                for (let enemy of my.sprite.enemyGroup.getChildren()) {
                    if (enemy.active) {
                        allDead = false;
                        break;
                    }
                }

            if (allDead) {
                this.gameOverShown = true;  // Prevent multiple triggers

                // Delay before showing text
                this.time.delayedCall(1500, () => {
                    this.add.bitmapText(400, 300, "rocketSquare", "LEVEL COMPLETE!", 32)
                        .setTint(0xffff00)
                        .setOrigin(0.5);
                }, [], this);

                // Delay before showing text
                this.time.delayedCall(4000, () => {
                    this.scene.start("mainScene2", { score: this.myScore });
                });
             }
            }
        }

        // A center-radius AABB collision check
        collides(a, b) {
            if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
            if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
            return true;
        }

        // Draws an x mark at every point along the spline.
        drawPoints() {
            for (let point of this.curve.points) {
                this.xImages.push(this.add.image(point.x, point.y, "x-mark"));
            }
        }

        // Draws the spline
        drawLine() {
            this.graphics.clear();                      // Clear the existing line
            this.graphics.lineStyle(2, 0xffffff, 1);    // A white line
            this.curve.draw(this.graphics, 32);         // Draw the spline
        }

        updateScore() {
            let my = this.my;
            my.text.score.setText("Score " + this.myScore);
        }

        updateHPDisplay() {
            let my = this.my;
            my.text.hpDisplay.setText("HP: " + this.my.sprite.elephant.hp);
        }
    }
            