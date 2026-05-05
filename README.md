# Module 3 (Alt): Working with Nitro Modules & Fabric Native Components — homework

Our lottery app has impressed our Tech Lead, but to stay ahead, our CTO and Board suggest adding fresh features. This will make us stand out and improve the user experience.

In this alternative track, we'll leverage **Nitro Modules** — a high-performance native module framework by [Margelo](https://margelo.com) — alongside **Fabric Native Components** from React Native's New Architecture. Nitro Modules use `HybridObject` interfaces, the **Nitrogen** code-generator, and pure Swift (iOS) or Kotlin (Android) implementations — no Objective-C++ needed for native logic.

> **Note:** Nitro Modules handle **native logic** (methods, properties, objects). For **native UI views**, we still use Fabric Native Components from React Native's Codegen — the same as in the Turbo Modules homework.

### Homework management :house:

The final result of all homework is the React Native Application full of features implemented iteratively in the end phase of each module in the course. In order to keep consistency and track all of your changes we highly recommend you to create your own GitHub repository where your work as a participant will be stored. Your GitHub repository should be shared with all trainers, which will enable us to verify your work and communicate:

- John Fanidis - https://github.com/Doberjohn
- Filip Jarno - https://github.com/ziarno

Each module in the course will end up with homework consisting of a few tasks to fulfil. We would like to suggest a comfortable system for you to submit each task of the homework as a separate PR to the main branch in your repository. This will create a space for us to communicate with you, by doing code reviews - thanks to that we will be able to check your homework, discuss some uncertainties, or respond to questions you will leave in the PR. In case you have any trouble with homework you can always book a 1 to 1 session with the trainer, and also don't hesitate to ask your questions in the dedicated communication channel. Keep in mind that you don't have to worry about being blocked for the next homework, every homework will have a starting point, so you always will be able to override the content of your repository with the prepared starting point.


### **End goal of this homework**

In this homework, we will create a **Notification Nitro Module** (using Hybrid Objects) and a **CustomButton Fabric Native Component**. Both will work on iOS and Android.

### Checkpoints 💡

The homework repository contains periodic checkpoints for your convenience. You will see callouts denoting the current checkpoint throughout this instruction. They will look something like this:


> 💡 You are now here → `checkpoint-xyz`

Feel free to check out the corresponding branch of any given checkpoint if you're struggling or simply want to compare your solution with ours.

With that out of the way, let's start!

## **Part 1: Create the Nitro Notification Library**

Nitro Modules are structured as separate library packages. Our notification module lives in `packages/nitro-notification/` as a local library.

*Step 1*. Review the `packages/nitro-notification/` directory structure. Key files include `nitro.json` (Nitrogen config), `NitroNotification.podspec` (iOS pod), `src/Notification.nitro.ts` (TypeScript spec), and platform-specific implementation directories.

*Step 2*. Open `packages/nitro-notification/nitro.json` and review the configuration — it maps the `Notification` Hybrid Object to its Swift (iOS) and Kotlin (Android) implementations via the `autolinking` section.

*Step 3*. Create the HybridObject spec in `packages/nitro-notification/src/Notification.nitro.ts`. The interface should extend `HybridObject<{ ios: 'swift'; android: 'kotlin' }>` and declare `showNotification(title: string, body: string): void`.

*Step 4*. Create the JS entry point in `packages/nitro-notification/src/index.ts`. Export the Hybrid Object using `NitroModules.createHybridObject<Notification>('Notification')`.

*Step 5*. Run Nitrogen from `packages/nitro-notification/` to generate native specs:

```sh
npx nitrogen
```

> 💡 You are now here → `checkpoint-1`


## **Part 2: Implement the Notification Nitro Module for iOS**

With Nitro, iOS implementations use pure Swift — no Objective-C++ needed.

*Step 1*. Create `packages/nitro-notification/ios/HybridNotification.swift`. The class should extend the Nitrogen-generated `HybridNotificationSpec` protocol and implement `showNotification` using `UNUserNotificationCenter`.

> 💡 You are now here → `checkpoint-2`


## **Part 3: Implement the Notification Nitro Module for Android**

On Android, Nitro implementations extend a Nitrogen-generated abstract class.

*Step 1*. Create `packages/nitro-notification/android/src/main/java/com/margelo/nitro/notification/HybridNotification.kt`. The class should extend `HybridNotificationSpec()`, be annotated with `@Keep`, and implement `showNotification` using Android's `NotificationManager` and `NotificationChannel`.

*Step 2*. Since Nitro's HybridObject doesn't receive a `ReactApplicationContext`, use a static `companion object` with an `init(context)` method to provide the Android `Context`.

*Step 3*. In `MainApplication.kt`, call `HybridNotification.init(this)` inside `onCreate()` to provide the application context.

> 💡 You are now here → `checkpoint-3`


## **Part 4: Create the CustomButton Fabric Native Component for iOS**

> This section is identical to the Turbo Modules homework. Nitro handles native logic, not native views — for views we use React Native's Fabric with Codegen.

*Step 1*. Create `specs/CustomButtonNativeComponent.ts` — the Fabric Component spec with `text`, `disabled`, and `onCustomButtonPress` props, exported via `codegenNativeComponent`.

*Step 2*. Configure `codegenConfig` in `package.json` with `type: "components"` (not `"all"` — the module part is handled by Nitro).

*Step 3*. In Xcode, create `RCTCustomButton.h` and `RCTCustomButton.mm` extending `RCTViewComponentView`. Implement `updateProps:oldProps:` for prop handling and dispatch events via `CustomButtonEventEmitter`.

*Step 4*. On Android, create `CustomButtonView.kt`, `CustomButtonViewManager.kt` (implementing the Codegen-generated `CustomButtonManagerInterface`), and `CustomButtonPackage.kt`. Register `CustomButtonPackage()` in `MainApplication.kt`.

> 💡 You are now here → `checkpoint-4`


## **Part 5: Use the Nitro Module & Fabric Component in JavaScript**

**Using the Notification Nitro Module:**

*Step 1.* Import the notification module from the local library:

```typescript
import { NotificationModule } from 'nitro-notification';
```

*Step 2.* Call `showNotification` where needed:

```typescript
NotificationModule.showNotification('Lottery Created', 'Your new lottery has been added successfully!');
```

> 💡 Remember to add permissions for the app to send notifications.

**Using the Custom Button Native Component:**

*Step 1.* Import the custom native component from the spec file:

```typescript
import CustomButton from '../specs/CustomButtonNativeComponent';
```

*Step 2.* Integrate the custom button component into your JSX:

```tsx
<CustomButton
  text="Register"
  disabled={!formik.isValid}
  onCustomButtonPress={() => formik.handleSubmit()}
  style={{ width: 120, height: 44 }}
/>
```

> 💡 You are now here → `checkpoint-5`
