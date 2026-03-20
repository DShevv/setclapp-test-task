import { useEffect } from "react";
import dayjs from "dayjs";
import { DatePicker, Form, Input, InputNumber, Modal } from "antd";

import type { DataRecord, RecordFormValues } from "./types";

interface RecordModalProps {
  open: boolean;
  initialValues: DataRecord | null;
  onCancel: () => void;
  onSubmit: (values: RecordFormValues) => void;
}

function RecordModal({
  open,
  initialValues,
  onCancel,
  onSubmit,
}: RecordModalProps) {
  const [form] = Form.useForm<RecordFormValues>();
  const isEditing = initialValues !== null;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        date: dayjs(initialValues.date),
        amount: initialValues.amount,
      });
    }
  }, [form, initialValues, open]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleFinish = (values: RecordFormValues) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      title={isEditing ? "Редактировать запись" : "Добавить запись"}
      okText={isEditing ? "Сохранить" : "Добавить"}
      cancelText="Отмена"
      destroyOnHidden
      onCancel={handleCancel}
      onOk={() => form.submit()}
    >
      <Form<RecordFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Имя"
          name="name"
          rules={[
            { required: true, whitespace: true, message: "Введите имя" },
            { min: 2, message: "Имя должно содержать минимум 2 символа" },
          ]}
        >
          <Input placeholder="Введите имя" maxLength={100} />
        </Form.Item>

        <Form.Item
          label="Дата"
          name="date"
          rules={[{ required: true, message: "Выберите дату" }]}
        >
          <DatePicker
            format="DD.MM.YYYY"
            placeholder="Выберите дату"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Числовое значение"
          name="amount"
          rules={[{ required: true, message: "Введите числовое значение" }]}
        >
          <InputNumber
            precision={2}
            placeholder="Введите значение"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default RecordModal;
