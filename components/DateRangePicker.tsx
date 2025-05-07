import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal, Platform } from "react-native";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";
import Button from "./Button";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeSelected: (startDate: Date, endDate: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onDateRangeSelected,
  minDate = new Date(),
  maxDate,
}: DateRangePickerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(endDate);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectionStep, setSelectionStep] = useState<"start" | "end">("start");

  const formatDate = (date: Date | null) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const openPicker = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setSelectionStep("start");
    setCurrentMonth(new Date());
    setIsVisible(true);
  };

  const closePicker = () => {
    setIsVisible(false);
  };

  const confirmSelection = () => {
    if (tempStartDate && tempEndDate) {
      onDateRangeSelected(tempStartDate, tempEndDate);
      closePicker();
    }
  };

  const resetSelection = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    setSelectionStep("start");
  };

  const handleDatePress = (date: Date) => {
    if (selectionStep === "start") {
      setTempStartDate(date);
      setTempEndDate(null);
      setSelectionStep("end");
    } else {
      if (tempStartDate && date < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
      // Don't close automatically, let user confirm
    }
  };

  const isDateSelected = (date: Date) => {
    if (!tempStartDate && !tempEndDate) return false;
    
    if (tempStartDate && tempEndDate) {
      return (
        date.getTime() === tempStartDate.getTime() ||
        date.getTime() === tempEndDate.getTime() ||
        (date > tempStartDate && date < tempEndDate)
      );
    }
    
    return tempStartDate ? date.getTime() === tempStartDate.getTime() : false;
  };

  const isStartDate = (date: Date) => {
    return tempStartDate && date.getTime() === tempStartDate.getTime();
  };

  const isEndDate = (date: Date) => {
    return tempEndDate && date.getTime() === tempEndDate.getTime();
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const previousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = isDateDisabled(date);
      const isSelected = isDateSelected(date);
      const isStart = isStartDate(date);
      const isEnd = isEndDate(date);
      
      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isStart && styles.startDay,
            isEnd && styles.endDay,
            isDisabled && styles.disabledDay,
          ]}
          onPress={() => !isDisabled && handleDatePress(date)}
          disabled={isDisabled}
        >
          <Text
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isDisabled && styles.disabledDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  return (
    <View>
      <TouchableOpacity style={styles.pickerButton} onPress={openPicker}>
        <Calendar size={20} color={Colors.primary} />
        <View style={styles.dateTextContainer}>
          <Text style={styles.dateLabel}>
            {startDate && endDate ? "Selected dates" : "Select dates"}
          </Text>
          <Text style={styles.dateValue}>
            {startDate && endDate
              ? `${formatDate(startDate)} - ${formatDate(endDate)}`
              : "Tap to select"}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closePicker}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Dates</Text>
              <Text style={styles.selectionText}>
                {selectionStep === "start" ? "Select start date" : "Select end date"}
              </Text>
            </View>

            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
                <ChevronLeft size={24} color={Colors.primary} />
              </TouchableOpacity>
              <Text style={styles.monthYearText}>
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
                <ChevronRight size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.weekdayHeader}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Text key={day} style={styles.weekdayText}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>{renderCalendar()}</View>

            <View style={styles.selectedDatesContainer}>
              <View style={styles.dateDisplay}>
                <Text style={styles.dateDisplayLabel}>Start Date</Text>
                <Text style={styles.dateDisplayValue}>
                  {formatDate(tempStartDate)}
                </Text>
              </View>
              <View style={styles.dateDisplay}>
                <Text style={styles.dateDisplayLabel}>End Date</Text>
                <Text style={styles.dateDisplayValue}>
                  {formatDate(tempEndDate)}
                </Text>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <Button
                title="Reset"
                onPress={resetSelection}
                variant="outline"
                style={styles.resetButton}
              />
              <Button
                title="Confirm"
                onPress={confirmSelection}
                disabled={!tempStartDate || !tempEndDate}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTextContainer: {
    marginLeft: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  selectionText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    color: Colors.text,
  },
  selectedDay: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  startDay: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  endDay: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "600",
  },
  disabledDay: {
    opacity: 0.3,
  },
  disabledDayText: {
    color: Colors.textSecondary,
  },
  selectedDatesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  dateDisplay: {
    flex: 1,
  },
  dateDisplayLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  dateDisplayValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
});