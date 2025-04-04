import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, Checkbox, Select, Button, Upload, message } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, PictureOutlined } from '@ant-design/icons';

const { Option } = Select;

interface ProductCreationModalProps {
  open: boolean;
  onClose: () => void;
}

const ProductCreationModal: React.FC<ProductCreationModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [isTodayChecked, setIsTodayChecked] = useState(false);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false); // Textarea ko'rinishini boshqarish uchun state
  const [description, setDescription] = useState(""); // Izohni saqlash uchun state

  // Izohni o'zgartirish
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  // TextArea ko'rsatish yoki yashirish
  const handleIzohButtonClick = () => {
    setIsDescriptionVisible(true); // Button bosilganda TextArea ochiladi
  };

  // Formni yuborish
  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        console.log('Form values:', values);
        message.success("Mahsulot muvaffaqiyatli yaratildi");
        form.resetFields();
        setIsDescriptionVisible(false);  // Izohni ko'rinmas qilish
        setDescription("");  // Izohni tozalash
        setIsTodayChecked(false); // Bugun checkbox'ini tozalash
        onClose();  // Modalni yopish
      })
      .catch((info) => {
        console.log('Validation failed:', info);
      });
  };

  // Modalni yopish va barcha ma'lumotlarni tozalash
  const handleModalClose = () => {
    form.resetFields();  // Form maydonlarini tozalash
    setIsDescriptionVisible(false);  // Izohni ko'rinmas qilish
    setDescription("");  // Izohni tozalash
    setIsTodayChecked(false); // Bugun checkbox'ini tozalash
    onClose();  // Modalni yopish
  };

  return (
    <Modal
      open={open}
      onCancel={handleModalClose}  // Modalni yopish
      footer={null}
      closable={false}
      width={420}
      centered
      className="product-creation-modal"
    >
      <div className="modal-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleModalClose}  // Modalni yopish
          className="back-button"
        />
        <h2 className="modal-title">Nasiya yaratish</h2>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          name="productName"
          label="Mahsulot nomi"
          rules={[{ required: true, message: 'Iltimos mahsulot nomini kiriting' }]} >
          <Input placeholder="Ismini kiriting" />
        </Form.Item>

        <Form.Item
          name="date"
          label="Sana"
          className="mb-4"
        >
          <div className="date-picker-wrapper">
            <DatePicker
              placeholder="Sanani kiriting"
              className="date-picker"
              disabled={isTodayChecked}
              suffixIcon={<CalendarOutlined className="calendar-icon" />}
            />
            <Checkbox
              checked={isTodayChecked}
              onChange={(e) => setIsTodayChecked(e.target.checked)}
            >
              Bugun
            </Checkbox>
          </div>
        </Form.Item>
        <Form.Item
          name="duration"
          label="Muddat"
        >
          <Select placeholder="Qarz muddatini tanlang">
            <Option value="1">1 oy</Option>
            <Option value="2">2 oy</Option>
            <Option value="3">3 oy</Option>
            <Option value="6">6 oy</Option>
            <Option value="12">12 oy</Option>
          </Select>
        </Form.Item>

        {!isDescriptionVisible && (
          <Form.Item>
            <Button type="dashed" onClick={handleIzohButtonClick} block>
              Izoh qo'shish
            </Button>
          </Form.Item>
        )}

        {isDescriptionVisible && (
          <Form.Item
            name="description"
            label="Izoh"
            rules={[{ required: true, message: 'Iltimos, izoh kiriting!' }]}>
            <Input.TextArea
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Izohni shu yerga yozing..."
              autoSize={{ minRows: 4, maxRows: 6 }} 
            />
          </Form.Item>
        )}

        <Form.Item
          name="images"
          label="Rasm biriktirish"
        >
          <Upload
            listType="picture-card"
            showUploadList={true}
            beforeUpload={() => false}
            maxCount={2}
          >
            <div className="upload-placeholder">
              <PictureOutlined className="upload-icon" />
              <span className="upload-text">Rasm qo'shish</span>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
            block
            size="large"
          >
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductCreationModal;
