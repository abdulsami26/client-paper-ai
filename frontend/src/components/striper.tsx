
const Striper = () => {
    return (
        <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    1
                </div>
                <span className="text-sm font-medium">Selection</span>
            </div>
            <div className="flex-1 flex items-center justify-center h-4 mt-2">
                <div className="w-full border-t border-muted-foreground" />
            </div>
            <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold">2</div>
                <span className="text-sm">Options</span>
            </div>
            <div className="flex-1 flex items-center justify-center h-4 mt-2">
                <div className="w-full border-t border-muted-foreground" />
            </div>
            <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border text-sm font-bold">3</div>
                <span className="text-sm">Confirmation</span>
            </div>
        </div>
    )
}

export default Striper