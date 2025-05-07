class Player extends Phaser.GameObjects.Sprite {

    // x,y - starting sprite location
    // spriteKey - key for the sprite image asset
    // leftKey - key for moving left
    // rightKey - key for moving right
    constructor(scene, x, y, texture, frame, leftKey, rightKey, playerSpeed) {
        super(scene, x, y, texture, frame);

        this.left = leftKey;
        this.right = rightKey;
        this.playerSpeed = playerSpeed;

        scene.add.existing(this);

        //Stats
        this.hp = 5;

        return this;
    }

    update() {
        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (this.x > (this.displayWidth/2)) {
                this.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (this.x < (game.config.width - (this.displayWidth/2))) {
                this.x += this.playerSpeed;
            }
        }
    }

    AddHP(value) {
        this.hp += value;
        this.CheckHP();
    }

    CheckHP() {
        if (this.hp <= 0) {
            //Death code here
            this.Die();
        }
    }

    Die(){
        this.setActive(false);
        this.setVisible(false);
        
        this.x = -100;  // move offscreen or reset

        // // Stop shooting when dead
        // if (this.shootTimer) {
        //     this.shootTimer.remove(false);
        // }
    }
}