import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import QRCode from 'qrcode.react'
import jsQR from "jsqr";
import './QrApp.css';

class QrApp extends React.Component {
    constructor() {
        super();
        this.state = {
            qrText: 'Enter Text',
            textBox: 'Enter Text',
            readQR: 'Converted Text'
        };
    }

    updateQR = (e) => {
        this.setState({textBox: e.target.value});
        console.log(this.state.readQR);
    };

    generateQR = () => {
        this.setState({qrText: this.state.textBox});
    };
    readQR = async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const clipboardItem of clipboardItems) {
                for (const type of clipboardItem.types) {
                    if (type !== 'image/png') {
                        alert("Clipboard contains non-image data. Unable to access it.");
                    } else {
                        let canvas = document.createElement('canvas');
                        const ctx = canvas.getContext("2d");
                        const blob = await clipboardItem.getType(type);
                        let img = new Image();
                        img.src = URL.createObjectURL(blob);
                        img.onload = () => {
                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);
                            let imageData = ctx.getImageData(0,0,img.width, img.height);
                            const code = jsQR(imageData.data, imageData.width, imageData.height);
                            if (code) {
                                this.setState({readQR: code.data});
                            }
                        }

                    }

                }
            }
        } catch (err) {
            console.error(err.name, err.message);
        }
    };

    render() {
        return (
            <div id='main-area'>
                <div id='qr-generator'>
                    <h1>
                        QR Generator
                    </h1>
                    <TextField
                        id="qr-text"
                        label="Qr Text"
                        multiline
                        rows={4}
                        defaultValue={this.state.qrText}
                        variant="outlined"
                        onChange={this.updateQR}
                    />
                    <div id='generate-button'>
                        <Button variant="contained" color="primary" onClick={this.generateQR}> Generate QR </Button>
                    </div>

                    <div id='qr-code'>
                        <QRCode value={this.state.qrText} />
                    </div>
                </div>

                <div id='qr-reader'>
                    <h1>
                        QR Reader
                    </h1>
                    <div id='read-button'>
                        <Button variant="contained" color="primary" onClick={this.readQR}> Read QR From Clipboard </Button>
                    </div>
                    <p>
                        {this.state.readQR}
                    </p>
                </div>

            </div>

        );
    }
}

export default QrApp;