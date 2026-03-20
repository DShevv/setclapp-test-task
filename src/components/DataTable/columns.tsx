import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Button, Popconfirm, type TableColumnsType } from "antd";

import type { DataRecord } from "./types";

interface GetColumnsOptions {
  actionsClassName: string;
  onDelete: (id: string) => void;
  onEdit: (record: DataRecord) => void;
}

export function getColumns({
  actionsClassName,
  onDelete,
  onEdit,
}: GetColumnsOptions): TableColumnsType<DataRecord> {
  return [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
      sorter: (firstRecord, secondRecord) =>
        firstRecord.name.localeCompare(secondRecord.name, "ru", {
          sensitivity: "base",
        }),
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (value: string) => dayjs(value).format("DD.MM.YYYY"),
      sorter: (firstRecord, secondRecord) =>
        dayjs(firstRecord.date).valueOf() - dayjs(secondRecord.date).valueOf(),
    },
    {
      title: "Числовое значение",
      dataIndex: "amount",
      key: "amount",
      sorter: (firstRecord, secondRecord) =>
        firstRecord.amount - secondRecord.amount,
    },
    {
      title: "Действия",
      key: "actions",
      render: (_, record) => (
        <div className={actionsClassName}>
          <Button
            type="text"
            aria-label="Редактировать запись"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />

          <Popconfirm
            title="Удалить запись?"
            description="Это действие нельзя отменить."
            okText="Удалить"
            okType="danger"
            cancelText="Отмена"
            onConfirm={() => onDelete(record.id)}
          >
            <Button
              danger
              type="text"
              aria-label="Удалить запись"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];
}
