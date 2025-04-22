function OverlayModal({ hideModal, children }) {
    const onHideModal = (e) => {
        if (e.target === e.currentTarget) {
            hideModal();
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-stone-800/50 z-50" onMouseUp={onHideModal}>
            <div className="absolute top-1/9 left-1/2 transform -translate-x-1/2">{children}</div>
        </div>
    );
}

export default OverlayModal;
