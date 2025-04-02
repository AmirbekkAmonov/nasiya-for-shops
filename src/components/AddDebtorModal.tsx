import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import {UploadOutlined} from '@ant-design/icons';
import useDebtor from "../hooks/useDebtor";
import '../styles/components/AddDebtorModal.scss'

const uzbPhoneCodes = [
  "90", "91", "93", "94", "95", "97", "98", "99", "88",
  "33", "55", "71", "74", "75", "76", "78", "79", "67", "66", "62", "61", "43", "36", "35"
];

const validatePhoneNumber = (phone: string) => {
  if (!phone.startsWith("+998")) return { valid: false, error: "Telefon +998 bilan boshlanishi kerak!" };
  if (phone.length < 13) return { valid: false, error: "Telefon raqam to'liq emas!" };

  const phonePattern = /^\+998(\d{2})\d{7}$/;
  const match = phone.match(phonePattern);
  if (!match) return { valid: false, error: "Telefon raqam noto'g'ri formatda!" };

  const code = match[1];
  if (!uzbPhoneCodes.includes(code)) return { valid: false, error: `${code} bu O'zbekiston telefon kodi emas!` };

  return { valid: true, error: "" };
};

interface AddDebtorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDebtor: (debtorData: any) => Promise<void>;
}

const AddDebtorModal: React.FC<AddDebtorModalProps> = ({ isOpen, onClose, onAddDebtor }) => {
  const { loading } = useDebtor();

  const initialFormData = {
    full_name: "",
    address: "",
    description: "",
    phone_numbers: ["+998", "+998"],
    images: ["", ""],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    phone1: "",
    phone2: "",
  });
  const [showErrors, setShowErrors] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    setFormData((prevData) => {
      const newPhoneNumbers = [...prevData.phone_numbers];
      newPhoneNumbers[index] = value;
      return { ...prevData, phone_numbers: newPhoneNumbers };
    });

    if (value.trim() === "+998") {
      setErrors((prev) => ({ ...prev, [`phone${index + 1}`]: "Telefon raqam kiritilishi shart!" }));
    } else {
      const { valid, error } = validatePhoneNumber(value);
      setErrors((prev) => ({ ...prev, [`phone${index + 1}`]: valid ? "" : error }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const fileURL = URL.createObjectURL(file);
      const newImages = [...formData.images];
      newImages[index] = fileURL;
      setFormData((prevData) => ({ ...prevData, images: newImages }));
    }
  };

  const handleAddPhoneNumber = () => {
    if (formData.phone_numbers.length < 4) {
      setFormData((prevData) => ({
        ...prevData,
        phone_numbers: [...prevData.phone_numbers, "+998"]
      }));
    }
  };

  const handleAddDescription = () => {
    setShowDescription(true);
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({ phone1: "", phone2: "" });
    setShowErrors(false);
    setShowDescription(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (errors.phone1 || errors.phone2 || formData.phone_numbers.includes("+998")) {
      message.error("Iltimos, telefon raqamlarni to'g'ri kiriting!");
      return;
    }

    if (formData.images.includes("")) {
      message.error("Iltimos, 2 ta rasmni yuklang.");
      return;
    }

    try {
      await onAddDebtor({
        full_name: formData.full_name,
        address: formData.address,
        description: formData.description,
        phone_numbers: formData.phone_numbers,
        images: formData.images,
      });

      handleClose();
    } catch (error) {
      message.error("Qarzdorni qo'shishda xatolik yuz berdi.");
    }
  };
  

  return (
    <Modal title="Qarzdorni qo'shish" visible={isOpen} onCancel={handleClose} footer={null} width={600} style={{ top: 20 }}>
      <form onSubmit={handleSubmit} className="add-debtor-form">
        <div className="add-debtor-form__name">
          <label>Ismi *</label>
          <Input type="text" name="full_name" placeholder="Ismini kiriting" value={formData.full_name} onChange={handleInputChange} required />
        </div>

        <div className="add-debtor-form__phone">
          <label>Telefon raqamlari *</label>
          {formData.phone_numbers.map((phone, index) => (
            <div key={index}>
              <Input
                type="text"
                value={phone}
                onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
                required
                status={showErrors && errors[`phone${index + 1}`] ? "error" : ""}
              />
              {showErrors && errors[`phone${index + 1}`] && (
                <span style={{ color: "red" }}>{errors[`phone${index + 1}`]}</span>
              )}
            </div>
          ))}
          {formData.phone_numbers.length < 4 && (
            <Button type="dashed" className="add-debtor-form__phone-add" onClick={handleAddPhoneNumber}>
              Ko'proq qo'shish
            </Button>
          )}
        </div>

        <div className="add-debtor-form__address">
          <label>Yashash manzili</label>
          <Input type="text" name="address" placeholder="Yashash manzilini kiriting" value={formData.address} onChange={handleInputChange} required />
        </div>

        <div className="add-debtor-form__description">
          {showDescription ? (
            <div>
              <label>Eslatma</label>
              <Input.TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
          ) : (
            <Button type="dashed" onClick={handleAddDescription}>
              Eslatma qo'shish
            </Button>
          )}
        </div>

        <div className="add-debtor-form__images">
          <label>Rasm biriktirish</label>
          <div className="image-upload-container">
            {formData.images.map((image, index) => (
              <div key={index} className="image-upload-item">
                <Button
                  type="default"
                  className="image-upload-button"
                >
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="image-input"
                  />
                  {!image ? (
                    <div className="image-placeholder">
                      <span className="upload-icon"><UploadOutlined /></span> 
                      <span>Rasm qo‘shish</span>
                    </div>
                  ) : (
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      className="image-preview"
                    />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-actions">
          <Button type="primary" htmlType="submit" loading={loading}>
            Saqlash
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDebtorModal;
