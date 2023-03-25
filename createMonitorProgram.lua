monitor = peripheral.wrap("monitor_1")
data = peripheral.wrap("create_target_1")
monitor.setTextScale(2)

printData = function (x, str) return (str.. data.getLine(x)) end
strings = {"Water Tank: ", "Lava Tank: ", "Network Stress: "}

while(1)do
    monitor.clear()
    term.clear()

    for i=1,#strings,1 do
        setCursorPos(1, i)
        monitor.write(printData(i, strings[1]))
        term.print(printData(i, strings[1]))
    end

    sleep(1)
end
