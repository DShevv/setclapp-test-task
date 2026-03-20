import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Button, Input, Table, Typography } from "antd";
import { useCallback, useMemo, useState } from "react";

import RecordModal from "./RecordModal";
import { getColumns } from "./columns";
import styles from "./DataTable.module.scss";
import type { DataRecord, RecordFormValues } from "./types";
import useLocalStorage from "../../hooks/useLocalStorage";

const DATE_DISPLAY_FORMAT = "DD.MM.YYYY";
const DATE_STORAGE_FORMAT = "YYYY-MM-DD";
const STORAGE_KEY = "data-table-records";

function DataTable() {
  const [records, setRecords] = useLocalStorage<DataRecord[]>(STORAGE_KEY, []);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataRecord | null>(null);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return records;
    }

    return records.filter((record) => {
      const searchableValue = [
        record.name,
        dayjs(record.date).format(DATE_DISPLAY_FORMAT),
        record.amount.toString(),
      ]
        .join(" ")
        .toLowerCase();

      return searchableValue.includes(normalizedSearch);
    });
  }, [records, searchText]);

  const handleDelete = useCallback(
    (id: string) => {
      setRecords((prev) => prev.filter((record) => record.id !== id));
    },
    [setRecords],
  );

  const handleEdit = useCallback((record: DataRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  }, []);

  const columns = useMemo(
    () =>
      getColumns({
        actionsClassName: styles.actions,
        onDelete: handleDelete,
        onEdit: handleEdit,
      }),
    [handleDelete, handleEdit],
  );

  const openCreateModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingRecord(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (values: RecordFormValues) => {
    const nextRecord = {
      name: values.name.trim(),
      date: values.date.format(DATE_STORAGE_FORMAT),
      amount: values.amount,
    };

    if (editingRecord) {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === editingRecord.id
            ? { ...record, ...nextRecord }
            : record,
        ),
      );
    } else {
      setRecords((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...nextRecord },
      ]);
    }

    closeModal();
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>
        <Typography.Title level={2} className={styles.title}>
          Таблица записей
        </Typography.Title>
        <Typography.Paragraph className={styles.description}>
          Добавляйте, редактируйте, удаляйте записи и выполняйте поиск по всем
          ячейкам таблицы.
        </Typography.Paragraph>
      </header>

      <div className={styles.toolbar}>
        <Input.Search
          allowClear
          value={searchText}
          className={styles.search}
          placeholder="Поиск по всем ячейкам"
          onChange={(event) => setSearchText(event.target.value)}
        />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          Добавить
        </Button>
      </div>

      <Table<DataRecord>
        rowKey="id"
        columns={columns}
        dataSource={filteredRecords}
        className={styles.table}
        classNames={{ content: styles.content }}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        locale={{
          emptyText: searchText
            ? "По вашему запросу ничего не найдено"
            : "Добавьте первую запись",
          triggerDesc: "Сортировать по убыванию",
          triggerAsc: "Сортировать по возрастанию",
          cancelSort: "Сбросить сортировку",
        }}
      />

      <RecordModal
        open={isModalOpen}
        initialValues={editingRecord}
        onCancel={closeModal}
        onSubmit={handleSubmit}
      />
    </section>
  );
}

export default DataTable;
