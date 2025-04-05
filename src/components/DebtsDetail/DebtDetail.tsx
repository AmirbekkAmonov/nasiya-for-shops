import { useParams, useNavigate } from "react-router-dom";
import { Card, Input, Button, Spin, Alert, DatePicker, TimePicker, Dropdown, Modal, message, Upload } from "antd";
import { MoreOutlined, EditOutlined, DeleteOutlined, SaveOutlined, CloseOutlined, UploadOutlined } from "@ant-design/icons";
import useDebts from "../../hooks/UseDebts";
import "../../styles/components/DebtDetail.scss";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

const DebtDetail = () => {
    const { debtId } = useParams();
    const navigate = useNavigate();
    const { getDebtById, deleteDebt, updateDebt } = useDebts("");
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [fileList, setFileList] = useState<any[]>([]);
    
    const { data: debt, isLoading: debtLoading, error: debtError } = getDebtById(debtId || "");

    useEffect(() => {
        if (debt?.images) {
            const formattedImages = debt.images.map((img: any) => ({
                uid: img.id || Math.random().toString(),
                name: img.image.split('/').pop() || 'image',
                status: 'done',
                url: img.image,
                image: img.image
            }));
            setFileList(formattedImages);
        }
    }, [debt]);

    const handleDelete = async () => {
        try {
            await deleteDebt(debtId || "");
            navigate(-1);
        } catch (error) {
            console.error("Error deleting debt:", error);
        }
    };

    const handleEdit = () => {
        if (debt) {
            setFormData({
                debt_sum: debt.debt_sum,
                total_month: debt.total_month,
                description: debt.description,
                next_payment_date: dayjs(debt.next_payment_date)
            });
        }
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const formattedImages = fileList.map(file => ({
                image: file.url || file.image
            }));

            await updateDebt({
                debtId: debtId || "",
                debtData: {
                    ...formData,
                    next_payment_date: formData.next_payment_date.format('YYYY-MM-DD'),
                    images: formattedImages
                }
            });
            setIsEditing(false);
            message.success('Qarz muvaffaqiyatli tahrirlandi');
        } catch (error) {
            message.error('Qarzni tahrirlashda xatolik yuz berdi');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({});
        if (debt?.images) {
            const formattedImages = debt.images.map((img: any) => ({
                uid: img.id || Math.random().toString(),
                name: img.image.split('/').pop() || 'image',
                status: 'done',
                url: img.image,
                image: img.image
            }));
            setFileList(formattedImages);
        }
    };

    const handleImageChange = ({ fileList }: any) => {
        setFileList(fileList);
    };

    const items = [
        {
            key: 'edit',
            label: 'Tahrirlash',
            icon: <EditOutlined />,
            onClick: handleEdit
        },
        {
            key: 'delete',
            label: 'O\'chirish',
            icon: <DeleteOutlined />,
            onClick: () => setIsDeleteModalVisible(true)
        }
    ];

    if (debtLoading) {
        return (
            <div className="DebtDetail">
                <div className="loading">
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    if (debtError) {
        return (
            <div className="DebtDetail">
                <Alert message={debtError as string} type="error" />
            </div>
        );
    }

    if (!debt) {
        return (
            <div className="DebtDetail">
                <Alert message="Qarz topilmadi" type="error" />
            </div>
        );
    }

    const debtDate = dayjs(debt.created_at);

    return (
        <div className="DebtDetail">
            <div className="header">
                <Button onClick={() => navigate(-1)}>&larr;</Button>
                <h2>Batafsil</h2>
                <div className="header-actions">
                    {isEditing && (
                        <Button 
                            icon={<CloseOutlined />} 
                            onClick={handleCancel}
                            style={{ marginRight: 8 }}
                        />
                    )}
                    <Dropdown menu={{ items }} placement="bottomRight">
                        <Button icon={<MoreOutlined />} />
                    </Dropdown>
                </div>
            </div>
            <Card className="detail-card">
                <label>Sana</label>
                <DatePicker 
                    defaultValue={debtDate} 
                    disabled={!isEditing} 
                    className="full-width" 
                />

                <label>Soat</label>
                <TimePicker 
                    defaultValue={debtDate} 
                    disabled={!isEditing} 
                    className="full-width" 
                />

                <label>Muddat</label>
                <Input 
                    value={isEditing ? formData.total_month : debt.total_month} 
                    onChange={(e) => setFormData({ ...formData, total_month: e.target.value })}
                    disabled={!isEditing} 
                    className="full-width" 
                />

                <label>Summa miqdori</label>
                <Input 
                    value={isEditing ? formData.debt_sum : debt.debt_sum} 
                    onChange={(e) => setFormData({ ...formData, debt_sum: e.target.value })}
                    disabled={!isEditing} 
                    className="full-width" 
                />

                <label>Eslatma</label>
                <Input.TextArea 
                    value={isEditing ? formData.description : debt.description} 
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={!isEditing} 
                    className="full-width" 
                />
            </Card>
            <div className="images-section">
                <h3>Suratlar</h3>
                {isEditing ? (
                    <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleImageChange}
                        beforeUpload={() => false}
                    >
                        <div>
                            <UploadOutlined />
                            <div style={{ marginTop: 8 }}>Yuklash</div>
                        </div>
                    </Upload>
                ) : (
                    <div className="images-container">
                        {debt.images?.map((img: any, index: number) => (
                            <img key={index} src={img.image} alt="Debt related" className="debt-image" />
                        ))}
                    </div>
                )}
            </div>
            {isEditing ? (
                <Button 
                    type="primary" 
                    className="pay-button"
                    onClick={handleSave}
                    icon={<SaveOutlined />}
                >
                    Saqlash
                </Button>
            ) : (
                <Button 
                    type="primary" 
                    className="pay-button"
                >
                    Nasiyani so'ndirish
                </Button>
            )}

            <Modal
                title="Qarzni o'chirish"
                open={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="O'chirish"
                cancelText="Bekor qilish"
                okButtonProps={{ danger: true }}
            >
                <p>Haqiqatan ham bu qarzni o'chirmoqchimisiz?</p>
            </Modal>
        </div>
    );
};

export default DebtDetail;
