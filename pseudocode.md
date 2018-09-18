//flow pseudocode

[X] get all events 
[X] for each event
[X]     get details on event
[X]     merge details with event
[X]     look for event in db
[X]    if event exists
[X]         check for changes
[X]        if changes
            update event in db
[X]            if cancelled or closed
[X]                add id to delete array
[X]            add event to update array
[X]        if no changes
[X]            do nothing
[X]    if event doesn't exist
        insert event to db
[X]        if cancelled or closed
[X]            do nothing
[X]        create load object
[X]        create strike object
[X]        add event to insert array

try to insert objects from insert array
    if object exists
        try update object

try to update objects from update array
    if object doesn't exist
        try to insert object

try to delete events in delete array
    if event doesn't exist
        