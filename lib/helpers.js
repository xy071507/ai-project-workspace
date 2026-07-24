export function joinClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function priorityClasses(priority) {
  const styles = {
    Low: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
    Medium: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
    High: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-300",
    Critical: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
  };
  return styles[priority] || styles.Low;
}
