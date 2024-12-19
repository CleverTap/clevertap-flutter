# Overview
You can define variables using the CleverTap Flutter plugin. When you define a variable in your code, you can sync them to the CleverTap Dashboard via the provided SDK methods.

# Supported Variable Types

Currently, the CleverTap Flutter plugin supports the following variable types:

- String
- bool
- Map<String, dynamic>
- int
- float
- double

Web Platform only supports primitive data types - String, Number and boolean

# Define Variables

Variables can be defined using the `defineVariables` method. You must provide the names and default values of the variables using a JSON Object. 

```Dart
var variables = {
              'flutter_var_string': 'flutter_var_string_value',
              'flutter_var_map': {
                'flutter_var_map_string': 'flutter_var_map_value'
              },
              'flutter_var_int': 6,
              'flutter_var_float': 6.9,
              'flutter_var_boolean': true
            };
CleverTapPlugin.defineVariables(variables);
```

# Define File Variables

CleverTap Flutter SDK supports file types for variables from version `3.0.0`. Supported file types include but are not limited to images (jpg, jpeg, png, gif), text files, and PDFs.

```Dart
CleverTapPlugin.defineFileVariable("fileVariable");
```


# Setup Callbacks

The CleverTap Flutter plugin provides several callbacks for the developer to receive feedback from the plugin. You can use them as per your requirement, using all of them is not mandatory. They are as follows:

- Status of fetch variables request
- `onVariablesChanged`
- `onValueChanged`

From version `3.0.0` onwards, the following callbacks are also supported:

- `onOneTimeVariablesChanged`
- `onVariablesChangedAndNoDownloadsPending`
- `onceVariablesChangedAndNoDownloadsPending`
- `onFileValueChanged`


## Status of Variables Fetch Request

This method provides a boolean flag to ensure that the variables are successfully fetched from the server.

```Dart
this.setState(() async {
    bool? success = await CleverTapPlugin.fetchVariables();
    print("fetchVariables result: " + success.toString());
});
```

## `onVariablesChanged`

This callback is invoked when variables are initialized with values fetched from the server. It is called each time new values are fetched.

```Dart
CleverTapPlugin.onVariablesChanged((variables) {
    print("onVariablesChanged: " + variables.toString());
});
```

## `onOneTimeVariablesChanged`

This callback is invoked once when variables are initialized with a value or changed with a new server value. Callback is triggered only once on app start, or when added if server values are already received.

```dart
CleverTapPlugin.onOneTimeVariablesChanged((variables) {
    print("onOneTimeVariablesChanged: " + variables.toString());
});
```

## `onValueChanged`

This callback is invoked when the value of the variable changes. You must provide the name of the variable whose value needs to be observed.

```Dart
CleverTapPlugin.onValueChanged('variable_name', (variable) {
    print("onValueChanged: " + variable.toString());
});
```

## `onVariablesChangedAndNoDownloadsPending`

This callback is invoked when variable values are changed and the files associated with it are downloaded and ready to be used. Callback is triggered each time new values are fetched and downloaded.

```dart
CleverTapPlugin.onVariablesChangedAndNoDownloadsPending((variables) => {
    print('onVariablesChangedAndNoDownloadsPending', variables);
});
```

## `onceVariablesChangedAndNoDownloadsPending`

This callback is invoked only once when variable values are changed and the files associated with it are downloaded and ready to be used. Callback is triggered only once for when new values are fetched and downloaded

```dart
CleverTapPlugin.onceVariablesChangedAndNoDownloadsPending((variables) => {
    print('onceVariablesChangedAndNoDownloadsPending', variables);
});
```

## `onFileValueChanged`

This callback is registered per file variable. It is called when the file associated with the file variable is downloaded and ready to be used.

```dart
CleverTapPlugin.onFileValueChanged('fileVariable', (variable) => {
    print('onFileValueChanged: ', variable);
});
```

# Sync Defined Variables

After defining your variables in the code, you must send/sync variables to the server. To do so, the app must be in DEBUG mode and mark a particular CleverTap user profile as a test profile from the CleverTap dashboard. [Learn how to mark a profile as **Test Profile**](https://developer.clevertap.com/docs/concepts-user-profiles#mark-a-user-profile-as-a-test-profile)

After marking the profile as a test profile, you must sync the app variables in DEBUG mode:

```Dart
// 1. Define CleverTap variables 
// …
// 2. Add variables/values changed callbacks
// …

// 3. Sync CleverTap Variables from DEBUG mode/builds
CleverTapPlugin.syncVariables();
```

> 📘 Key Points to Remember
> 
> - In a scenario where there is already a draft created by another user profile in the dashboard, the sync call will fail to avoid overriding important changes made by someone else. In this case, Publish or Dismiss the existing draft before you proceed with syncing variables again. However, you can override a draft you created via the sync method previously to optimize the integration experience.
> - You can receive the following console logs from the CleverTap SDK:
>   - Variables synced successfully.
>   - Unauthorized access from a non-test profile. Please mark this profile as a test profile from the CleverTap dashboard.

# Fetch Variables During a Session

You can fetch the updated values for your CleverTap variables from the server during a session. If variables have changed, the appropriate callbacks will be fired. The provided callback provides a boolean flag that indicates if the fetch call was successful. The callback is fired regardless of whether the variables have changed or not.

```Dart
this.setState(() async {
    bool? success = await CleverTapPlugin.fetchVariables();
    print("fetchVariables result: " + success.toString());
});
```

# Use Fetched Variables Values

This process involves the following two major steps:

1. Fetch variable values.
2. Access variable values.

## Fetch Variable Values

Variables are updated automatically when server values are received. If you want to receive feedback when a specific variable is updated, use the individual callback:

```Dart
CleverTapPlugin.onValueChanged('variable_name', (variable) {
    print("onValueChanged: " + variable.toString());
});
```

## Access Variable Values

You can access these fetched values in the following two ways:

### Getting all variables

```Dart
this.setState(() async {
    Map<Object?, Object?> variables = await CleverTapPlugin.getVariables();
    print('getVariables: ' + variables.toString());
});
```

### Getting a specific variable

```Dart
this.setState(() async {
    var variable = await CleverTapPlugin.getVariable('variable_name');
    print('variable value for key \'flutter_var_string\': ' + variable.toString());
});
```
