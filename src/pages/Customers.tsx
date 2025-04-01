import { useState } from "react";
import { EditOutlined, PlusOutlined, SearchOutlined, SlidersOutlined, StarFilled, StarOutlined, UserAddOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Spin, Alert, Modal, Input, Button, Upload } from "antd";
import useDebtor from "../hooks/useDebtor";
import "../styles/pages/Customer.scss";

const Customers = () => {
  const { debtors, loading, error } = useDebtor();
  const [filterVisible, setFilterVisible] = useState(false);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [noteVisible, setNoteVisible] = useState(false);
  const [images, setImages] = useState<(string | null)[]>([null, null]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const resetForm = () => {
    setName("");
    setAddress("");
    setPhoneNumbers([""]);
    setNote("");
    setNoteVisible(false);
    setImages([null, null]);
  };

  const addPhoneNumber = () => {
    if (phoneNumbers.length < 3) {
      setPhoneNumbers([...phoneNumbers, ""]);
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updatedPhones = [...phoneNumbers];
    updatedPhones[index] = value;
    setPhoneNumbers(updatedPhones);
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedImages = [...images];
      updatedImages[index] = e.target?.result as string;
      setImages(updatedImages);
    };
    reader.readAsDataURL(file);
  };

  const menuItems: MenuProps["items"] = [
    { key: "1", label: "Mashhur" },
    { key: "2", label: "Yangi mijozlar" },
    { key: "3", label: "Faol mijozlar" },
    { key: "4", label: "No-faol mijozlar" },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };




  return (
    <section className="customers">
      <div className="container">
        <div className="customers__search">
          <form className="customers__search-form">
            <input type="text" placeholder="Mijozlarni qidirish..." />
            <SearchOutlined className="customers__search-icon" />
          </form>

          <Dropdown menu={{ items: menuItems }} trigger={["click"]} open={filterVisible} onOpenChange={setFilterVisible}>
            <button className="customers__search-btn">
              <SlidersOutlined className="customers__search-btn__icon" />
            </button>
          </Dropdown>
        </div>

        {loading ? (
          <Spin size="large" className="customers__loading" />
        ) : error ? (
          <Alert message={error} type="error" />
        ) : (
          <div className="customers__list">
            {Array.isArray(debtors) && debtors.length > 0 ? (
              debtors.map((customer) => {
                const totalDebt = customer.debts.reduce(
                  (sum, debt) => sum + parseFloat(debt.debt_sum || "0"),
                  0
                );
                return (
                  <div key={customer.id} className="customers__item">
                    <div className="customers__info">
                      <h3 className="customers__name">{customer.full_name}</h3>
                      <p className="customers__phone">
                        {customer.phone_numbers.length > 0 ? customer.phone_numbers[0].number : "Telefon raqami yo‘q"}
                      </p>
                      <p className="customers__debt-label">Jami nasiya:</p>
                      <p className={`customers__debt ${totalDebt < 0 ? "negative" : "positive"}`}>
                        {totalDebt.toLocaleString()} so'm
                      </p>
                    </div>
                    <div className="customers__favorite" onClick={() => toggleFavorite(customer.id)}>
                      {favorites[customer.id] ? <StarFilled className="star-icon active" /> : <StarOutlined className="star-icon" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Hech qanday mijoz topilmadi.</p>
            )}
          </div>
        )}

        {!loading && (
          <button className="customers__add" onClick={() => { setIsModalOpen(true); resetForm(); }}>
            <UserAddOutlined />
            Yaratish
          </button>
        )}
      </div>

      <Modal title="Mijoz yaratish" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} style={{ top: 20 }}>
        <form className="customer-form">
          <div className="customer-form__name">
            <label>Ismi *</label>
            <Input placeholder="Ismini kiriting" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="customer-form__phone">
            <label>Telefon raqami *</label>
            {phoneNumbers.map((phone, index) => (
              <Input
                key={index}
                placeholder="Telefon raqami"
                value={phone}
                onChange={(e) => handlePhoneChange(index, e.target.value)}
                style={{ marginBottom: "8px" }}
              />

            ))}
            {phoneNumbers.length < 3 && (
              <Button type="link" onClick={addPhoneNumber} icon={<PlusOutlined />} className="customer-form__phone-add">
                Ko'proq qo'shish
              </Button>
            )}
          </div>

          <div className="customer-form__address">
            <label>Yashash manzili</label>
            <Input placeholder="Yashash manzilini kiriting" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          <div className="customer-form__note">
            {!noteVisible ? (
              <Button type="dashed" onClick={() => setNoteVisible(true)} block>
                Eslatma qo'shish
              </Button>
            ) : (
              <div className="customer-form__note-input">
                <Input.TextArea placeholder="Eslatmani kiriting" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
                <Button type="link" onClick={() => { setNote(""); setNoteVisible(false); }} className="customer-form__note-clear">Eslatmani olib tashlash</Button>
              </div>
            )}
          </div>

          <div className="customer-form__images">
            <label>Rasm biriktirish</label>
            <div className="customer-form__upload">
              {images.map((image, index) => (
                <div key={index} className="upload-box">
                  {image ? (
                    <div className="image-preview" style={{ backgroundImage: `url(${image})` }}>
                      <div className="overlay">
                        <Button

                          shape="round"
                          icon={<EditOutlined />}
                          onClick={() => document.getElementById(`upload-${index}`)?.click()}
                        >
                          O'zgartirish
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Upload
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleImageUpload(index, file);
                        return false;
                      }}
                    >
                      <div className="upload-box empty">
                        <PlusOutlined className="upload-icon" />
                        <span>Rasm qo'shish</span>
                      </div>
                    </Upload>
                  )}
                  <input
                    type="file"
                    id={`upload-${index}`}
                    style={{ display: "none" }}
                    onChange={(e) => e.target.files && handleImageUpload(index, e.target.files[0])}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button type="primary" className="customer-form__submit" block>
            Saqlash
          </Button>
        </form>
      </Modal>
    </section>
  );
};

export default Customers;
