class Enemy extends Phaser.GameObjects.PathFollower {
    constructor(scene, path, x, y, texture) {
        super(scene, path, x, y, texture);
        scene.add.existing(this);  // REQUIRED!
        this.setScale(0.25);
        this.scorePoints = 25;

        //Stats
        this.hp = 3;
        this.attackSpeed = 3000;
        this.bulletSpeed = 3.5;
        this.bulletHorizontalSpeed = 0;
        this.bulletAmount = 1;

        //Create an initialDelay
        const initialDelay = Phaser.Math.Between(500, 3000);

         //Wait for initial delay, then start constant shooting
        scene.time.delayedCall(initialDelay, () => {
            this.shootTimer = scene.time.addEvent({
                delay: this.attackSpeed,              // Fixed interval after that
                callback: this.Shoot,
                callbackScope: this,
                loop: true
            });
        });
    }

    
    update() {
        // Enemy logic here
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
        this.stopFollow();
        this.x = -100;  // move offscreen or reset

        //Stop shooting when dead
        if (this.shootTimer) {
           this.shootTimer.remove(false);
        }
    }

    Shoot() {
        
        for (let i = 0; i < this.bulletAmount; i++) {
            let bullet = this.scene.my.sprite.enemyBulletGroup.getFirstDead();
            if (bullet) {
                // Position bullet at enemy's location, offset slightly for spread if needed
                const spreadOffset = (i - (this.bulletAmount - 1) / 2) * 60;  // even spread
                bullet.x = this.x + spreadOffset;
                bullet.y = this.y + (this.displayHeight / 2);

                // Assign bullet speeds
                bullet.speed = this.bulletSpeed;
                bullet.horizontalSpeed = this.bulletHorizontalSpeed;
                bullet.makeActive();
            }
        }
    }
}