"use strict";
new Vue({
    el: 'main',
    data: {
        name: 'Vue ' + Vue.version,
        width: 300,
        height: 100,
        signature: '#',
    },
    methods: {
        clearSignature() {
            this.$refs.sig.clearSignature();
        },
    },
    components: {
        SignatureInput: {
            template: '#signature-input',
            props: {
                height: Number,
                width: Number,
                color: {
                    default: 'black',
                },
                value: String,
            },
            data() {
                return {
                    context: null,
                };
            },
            methods: {
                clearSignature() {
                    this.clearCanvas();
                    this.drawSignatureLine();
                },
                clearCanvas() {
                    this.context.clearRect(0, 0, this.width, this.height);
                },
                update() {
                    this.previousCoordinates = null;
                    this.$emit('input', this.$refs.canvas.toDataURL());
                },
                drawLineTo(e) {
                    const canvas = this.$refs.canvas;
                    const currentCoordinates = {
                        x: e.pageX - canvas.offsetParent.offsetLeft,
                        y: e.pageY - canvas.offsetParent.offsetTop,
                    };
                    if (this.previousCoordinates) {
                        this.drawLine(this.previousCoordinates, currentCoordinates);
                    }
                    this.previousCoordinates = currentCoordinates;
                },
                drawLine(p1, p2) {
                    const ctx = this.context;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.closePath();
                },
                drawSignatureLine() {
                    return;
                    const ctx = this.context;
                    const originalStyle = ctx.strokeStyle;
                    ctx.strokeStyle = 'grey';
                    const height = this.height - 30;
                    // Draw the line
                    this.drawLine({
                        x: 0,
                        y: height
                    }, {
                        x: this.width,
                        y: height
                    });
                    // Draw the X
                    this.drawLine({
                        x: 5,
                        y: height - 5
                    }, {
                        x: 15,
                        y: height - 15
                    });
                    this.drawLine({
                        x: 5,
                        y: height - 15
                    }, {
                        x: 15,
                        y: height - 5
                    });
                    ctx.strokeStyle = originalStyle;
                },
            },
            mounted() {
                const ctx = this.context = this.$refs.canvas
                    .getContext('2d');
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                this.drawSignatureLine();
                this.update();
            },
        },
    },
});