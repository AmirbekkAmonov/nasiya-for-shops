import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import  useDebtor  from "../hooks/useDebtor";

// O‘zbekiston telefon raqamini tekshiruvchi funksiya
const isValidPhoneNumber = (phone: string) => {
  const phonePattern = /^\+998\d{9}$/; // O'zbekiston telefon raqami formati
  return phonePattern.test(phone);
};

const AddDebtorModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { addDebtor, loading, error } = useDebtor();
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    description: "",
    store: "",
    phone_numbers: ["", ""], // Telefon raqamlarining boshlang'ich qiymati
    images: [] as string[], // Rasmlar uchun boshlang'ich qiymat
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const newPhoneNumbers = [...formData.phone_numbers];
    newPhoneNumbers[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      phone_numbers: newPhoneNumbers,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files) {
      const file = e.target.files[0]; // Faqat bitta faylni olish
      const fileURL = URL.createObjectURL(file); // Faylni URLga aylantirish
      const newImages = [...formData.images];
      newImages[index] = fileURL; // Image massivida index bo‘yicha yangilash
      setFormData((prevData) => ({
        ...prevData,
        images: newImages,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Telefon raqamlarini validatsiya qilish
    const validPhoneNumbers = formData.phone_numbers.filter(
      (num) => num.trim() !== "" && isValidPhoneNumber(num)
    );

    if (validPhoneNumbers.length < 2) {
      console.log("Iltimos, kamida 2 ta telefon raqamini kiriting.");
      return;
    }

    // Rasmlar maydonini validatsiya qilish
    if (formData.images.length !== 2) { // Rasmlar soni 2 ta bo'lishi kerak
      console.log("Iltimos, rasmlar maydoni kamida 2 va ko‘p bo‘lmasligi kerak.");
      return;
    }

    // Formani yuborish
    const result = await addDebtor({
      full_name: formData.full_name,
      address: formData.address,
      description: formData.description,
      store: formData.store,
      phone_numbers: validPhoneNumbers,
      images: formData.images, // Rasmlar qo‘shilmoqda
    });

    if (result) {
      message.success("Qarzdor muvaffaqiyatli qo'shildi!");
      onClose(); // Modalni yopish
    } else {
      message.error("Xato yuz berdi.");
    }
  };

  return (
    <Modal
      title="Qarzdorni qo'shish"
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <Input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <Input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Store:</label>
          <Input
            type="text"
            name="store"
            value={formData.store}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone Number 1:</label>
          <Input
            type="text"
            value={formData.phone_numbers[0]}
            onChange={(e) => handlePhoneNumberChange(0, e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number 2:</label>
          <Input
            type="text"
            value={formData.phone_numbers[1]}
            onChange={(e) => handlePhoneNumberChange(1, e.target.value)}
            required
          />
        </div>

        <div>
          <label>Image 1:</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 0)}
            required
          />
        </div>

        <div>
          <label>Image 2:</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 1)}
            required
          />
        </div>

        <Button type="primary" htmlType="submit" disabled={loading} style={{ marginTop: 20 }}>
          {loading ? "Yuklanmoqda..." : "Qo'shish"}
        </Button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Rasmlar oldindan ko'rsatish */}
      <div style={{ marginTop: 20 }}>
        {formData.images.map((img, index) => (
          <img key={index} src={img} alt={`Preview ${index}`} width="100" height="100" />
        ))}
      </div>
    </Modal>
  );
};

export default AddDebtorModal;
