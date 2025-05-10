export default function Modal({ onClose, children }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#1f1f1f",
    padding: "2rem",
    borderRadius: "10px",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    color: "white",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  content: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.6",
  },
};
