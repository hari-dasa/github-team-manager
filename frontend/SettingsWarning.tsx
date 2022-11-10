import React, {useEffect} from "react";
import { Icon } from "@airtable/blocks/ui";
import { Alert } from "react-bootstrap";

const SettingsWarning = () => {
    return (
        <>
            <Alert variant="warning">
                <Alert.Heading>Check the settings!</Alert.Heading>
                <p>
                    Define all settings before using the extension.
                </p>
                <hr />
                <p className="mb-0">
                    Go to the settings interface, click on the engine
                    icon  (
                        <Icon name="cog" size={16} />
                    ) and define all settings from configuration tab.
                </p>
            </Alert>
        </>
    )
}

export default SettingsWarning;