import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarHeader = ({
  view,
  onViewChange,
  currentDate,
  onPrevious,
  onNext,
  onToday,
}) => {
  const getDateRangeText = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "week") {
      return `Week of ${format(currentDate, "MMM d, yyyy")}`;
    } else if (view === "day") {
      return format(currentDate, "EEEE, MMMM d, yyyy");
    } else {
      return format(currentDate, "MMMM yyyy");
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-x-2">
        <Button onClick={onPrevious} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button onClick={onNext} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button onClick={onToday} variant="outline" className="ml-2">
          Today
        </Button>
        <h2 className="text-xl font-semibold ml-4">{getDateRangeText()}</h2>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          onClick={() => onViewChange("month")}
          variant={view === "month" ? "default" : "outline"}
          size="sm"
        >
          Month
        </Button>
        <Button
          onClick={() => onViewChange("week")}
          variant={view === "week" ? "default" : "outline"}
          size="sm"
        >
          Week
        </Button>
        <Button
          onClick={() => onViewChange("day")}
          variant={view === "day" ? "default" : "outline"}
          size="sm"
        >
          Day
        </Button>
        <Button
          onClick={() => onViewChange("agenda")}
          variant={view === "agenda" ? "default" : "outline"}
          size="sm"
        >
          Agenda
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
