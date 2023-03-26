import ReactDOM from 'react-dom'
import '../styles/modal.scss'

const Modal = ({ children, handleClose }) => {
    return ReactDOM.createPortal((
        <div className="modal">
            <div className="modal__content">
                <div className="modal__content__header">
                    <button className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal__content__body">
                    { children }
                </div>
            </div>
        </div>
    ), document.body)
}

export default Modal
