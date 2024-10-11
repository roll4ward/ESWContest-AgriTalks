import Modal from "react-modal"

export const ModalBase = ({show, children}) => {
    const styles = {
        overlay: {
            backgroundColor: " rgba(0, 0, 0, 0.4)",
            width: "100vw",
            height: "100vh",
            zIndex: "10",
            position: "fixed",
            top: "0",
            left: "0",
          },
          content: {
            padding: "15px",
            width: "1278px",
            height: "839px",
            zIndex: "150",
            borderRadius: "40px",
            backgroundColor: "white",
            justifyContent: "center",
            overflow: "hidden",
            position: 'absolute', 
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
    };

    return (
        <Modal
            isOpen={show}
            style={styles}>
            {children}
        </Modal>
    )
}