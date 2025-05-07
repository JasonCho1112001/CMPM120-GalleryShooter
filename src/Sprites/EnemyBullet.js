class EnemyBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {        
        super(scene, x, y, texture, frame);
        this.visible = false;
        this.active = false;
        scene.add.existing(this);

        this.setScale(1.5);
        this.horizontalSpeed = 0;
        return this;
    }

    update() {
        if (this.active) {
            this.y += this.speed;
            this.x += this.horizontalSpeed;
            if (this.y > (600 + 100)) {
                this.makeInactive();
            }
        }
    }

    makeActive() {
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        this.visible = false;
        this.active = false;
    }

}