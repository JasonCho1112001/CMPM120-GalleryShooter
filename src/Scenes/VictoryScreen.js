class VictoryScreen extends Phaser.Scene {

    constructor() {
        super("victoryScreen");

        this.myScore = 0;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("Scrolling_Starfield", "Scrolling_Starfield.jpg");


        //font
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    init(data) {
        this.myScore = data.score;
    }

    create() {
        //Background
        this.starfield = this.add.tileSprite(0, 0, 800, 600, "Scrolling_Starfield").setOrigin(0, 0);

        // Add the flashing text
        const promptText = this.add.bitmapText(400, 300, "rocketSquare", "Press any key to play again!", 24)
            .setOrigin(0.5)
            .setTint(0xffff00);

        // Flash effect using tween (alpha from 1 to 0 and back)
        this.tweens.add({
            targets: promptText,
            alpha: 0,               
            duration: 500,          
            ease: 'Linear',
            yoyo: true,             
            repeat: -1              
        });

        // Centered message
        this.add.bitmapText(400, 100, "rocketSquare", "Congratulations!\n Your score is: " + this.myScore, 32)
            .setOrigin(0.5)
            .setTint(0xffff00);

            
        // Continue on any key press
        this.input.keyboard.on('keydown', () => {
            this.scene.start("mainScene", { reset: true });

        });

        
    }

    update() {
        //Background
        this.starfield.tilePositionY -= 1;
    }
}