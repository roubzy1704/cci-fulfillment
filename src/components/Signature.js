import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import '../css/Signature.css';

const Signature = forwardRef((props, ref) => {
    const sigCanvas = useRef({});
    const [isSigned, setIsSigned] = useState(false);
    const [acceptedSignature, setAcceptedSignature] = useState(null);

    const setCanvasDimensions = () => {
        if (sigCanvas.current) {
            const canvas = sigCanvas.current.getCanvas();
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
    };

    useEffect(() => {
        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);
        return () => {
            window.removeEventListener('resize', setCanvasDimensions);
        }
    }, []);

    useImperativeHandle(ref, () => ({
        clear: () => {
            sigCanvas.current.clear();
            setIsSigned(false);
            setAcceptedSignature(null);
        },
        accept: () => {
            if (sigCanvas.current && !acceptedSignature) {
                const signatureDataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
                props.onAccept(signatureDataUrl);
                setAcceptedSignature(signatureDataUrl);
                setIsSigned(true);
            }
        }
    }));

    return (
        <div className="signature-container">
            <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                    className: 'signature-canvas'
                }}
                onEnd={() => setIsSigned(true)}
            />
            <div className="button-container">
                <button onClick={() => ref.current.clear()}>Clear</button>
                <button onClick={() => ref.current.accept()} disabled={!isSigned}>Accept Signature</button>
            </div>
        </div>
    );
});

export default Signature;
