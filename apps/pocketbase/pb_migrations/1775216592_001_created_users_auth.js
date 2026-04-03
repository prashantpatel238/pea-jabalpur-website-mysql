/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let collection = new Collection({
        type: "auth",
        name: "users",
        listRule: "@request.auth.role = \"admin\"",
        viewRule: "@request.auth.id = id",
        createRule: "",
        updateRule: "@request.auth.id = id || @request.auth.role = \"admin\"",
        deleteRule: "@request.auth.role = \"admin\"",
        authRule: "@request.auth.id != \"\"",
        fields: [
        {
                "hidden": false,
                "id": "select7870118664",
                "name": "role",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                        "admin",
                        "member_manager",
                        "member"
                ]
        },
        {
                "hidden": false,
                "id": "select6325876794",
                "name": "account_status",
                "presentable": false,
                "primaryKey": false,
                "required": false,
                "system": false,
                "type": "select",
                "maxSelect": 1,
                "values": [
                        "active",
                        "disabled"
                ]
        }
],
    })

    try {
        app.save(collection)
    } catch (e) {
        if (e.message.includes("Collection name must be unique")) {
            console.log("Collection already exists, skipping")
            return
        }
        throw e
    }
}, (app) => {
    try {
        let collection = app.findCollectionByNameOrId("users")
        app.delete(collection)
    } catch (e) {
        if (e.message.includes("no rows in result set")) {
            console.log("Collection not found, skipping revert");
            return;
        }
        throw e;
    }
})
