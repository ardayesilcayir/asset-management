"use client";

import { useEffect } from "react";

interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ title, onClose, children }: ModalProps) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <div
            className="modal-backdrop"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="modal" role="dialog" aria-modal="true">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                    <h2 className="modal-title" style={{ margin: 0 }}>
                        {title}
                    </h2>
                    <button
                        className="btn-icon"
                        onClick={onClose}
                        aria-label="Close"
                        style={{ flexShrink: 0 }}
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
