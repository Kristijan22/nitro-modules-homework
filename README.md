

# Module 3 (Alt): Working with Nitro Modules & Fabric Native Components — homework

Our lottery app has impressed our Tech Lead, but to stay ahead, our CTO and Board suggest adding fresh features. This will make us stand out and improve the user experience.

In this alternative track, we'll leverage **Nitro Modules** — a high-performance native module framework by [Margelo](https://margelo.com) — alongside **Fabric Native Components** from React Native's New Architecture. Nitro Modules offer a different approach to native code than Turbo Modules:

1. You define a **TypeScript specification** using `HybridObject` interfaces in `*.nitro.ts` files.
2. **Nitrogen** (Nitro's code-generator) generates native specs — Swift protocols, Kotlin interfaces, and C++ bindings.
3. You implement the generated specs in **Swift** (iOS) or **Kotlin** (Android) — no Objective-C++ needed on iOS.
4. At runtime, Hybrid Objects communicate over **JSI** with near-zero overhead — benchmarks show **~16x faster** method calls compared to Turbo Modules.

> **Note:** Nitro Modules handle **native logic** (methods, properties, objects). For **native UI views**, we still use Fabric Native Components from React Native's Codegen — the same as in the Turbo Modules homework. The `CustomButton` Fabric component is identical between both tracks.

### Homework management :house:

The final result of all homework is the React Native Application full of features implemented iteratively in the end phase of each module in the course. In order to keep consistency and track all of your changes we highly recommend you to create your own GitHub repository where your work as a participant will be stored. Your GitHub repository should be shared with all trainers, which will enable us to verify your work and communicate:

- John Fanidis - https://github.com/Doberjohn
- Filip Jarno - https://github.com/ziarno

Each module in the course will end up with homework consisting of a few tasks to fulfil. We would like to suggest a comfortable system for you to submit each task of the homework as a separate PR to the main branch in your repository. This will create a space for us to communicate with you, by doing code reviews — thanks to that we will be able to check your homework, discuss some uncertainties, or respond to questions you will leave in the PR. In case you have any trouble with homework you can always book a 1 to 1 session with the trainer, and also don't hesitate to ask your questions in the dedicated communication channel. Keep in mind that you don't have to worry about being blocked for the next homework, every homework will have a starting point, so you always will be able to override the content of your repository with the prepared starting point.

### End goal of this homework

In this homework, we will create a **Notification Nitro Module** (using Hybrid Objects) and a **CustomButton Fabric Native Component** — the Notification module uses Nitro's framework for native logic, while the CustomButton uses React Native's Codegen for the native view. Both will work on iOS and Android.

### Checkpoints 💡

The homework repository contains periodic checkpoints for your convenience. You will see callouts denoting the current checkpoint throughout this instruction. They will look something like this:

> 💡 You are now here → `checkpoint-xyz`

Feel free to check out the corresponding branch of any given checkpoint if you're struggling or simply want to compare your solution with ours.

With that out of the way, let's start!

---

## Part 1: Understand the Architecture — Nitro Modules vs. Turbo Modules

Before we write code, let's understand what makes Nitro Modules different:

| Aspect | Turbo Modules | Nitro Modules |
|---|---|---|
| **Spec format** | `Native*.ts` extending `TurboModule` | `*.nitro.ts` extending `HybridObject` |
| **Code generator** | React Native Codegen | Nitrogen |
| **iOS language** | Objective-C++ (`.mm`) | Swift (direct C++ interop, no Obj-C) |
| **Android language** | Kotlin extending Codegen abstract class | Kotlin extending Nitrogen-generated spec |
| **JS ↔ Native bridge** | JSI via `TurboModuleRegistry` | JSI via `NitroModules.createHybridObject()` |
| **Performance** | ~116ms for 100k calls | ~7ms for 100k calls (benchmarks) |
| **Module structure** | Inline in app (specs/ folder) | Separate library package (recommended) |
| **Object model** | Flat module exports | Object-oriented (Hybrid Objects with prototype chain) |

Nitro Modules are structured as **separate library packages** — this is the recommended pattern and teaches good separation of concerns. Our notification module will live in `packages/nitro-notification/` as a local library.

---

## Part 2: Create the Nitro Notification Library

### Step 1. Set up the library package

The `packages/nitro-notification/` directory has already been scaffolded for you. Here's the structure:

```
packages/nitro-notification/
├── package.json                    # Library package config
├── nitro.json                      # Nitrogen configuration
├── NitroNotification.podspec       # iOS CocoaPod spec
├── react-native.config.js          # RN CLI config for Android CMake
├── src/
│   ├── Notification.nitro.ts       # HybridObject TypeScript spec
│   └── index.ts                    # JS entry point
├── ios/
│   └── HybridNotification.swift    # iOS implementation
├── android/
│   ├── build.gradle                # Android library build config
│   ├── CMakeLists.txt              # C++ build config for JNI
│   ├── fix-prefab.gradle           # Prefab fix for native builds
│   ├── gradle.properties           # Default SDK versions
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── cpp/
│       │   └── cpp-adapter.cpp     # JNI entry point
│       └── java/com/margelo/nitro/notification/
│           ├── NitroNotificationPackage.kt   # React Native package
│           └── HybridNotification.kt         # Android implementation
└── nitrogen/
    └── generated/                  # Generated by Nitrogen (committed to git)
```

### Step 2. Understand the `nitro.json` configuration

Open `packages/nitro-notification/nitro.json`:

```json
{
  "$schema": "https://nitro.margelo.com/nitro.schema.json",
  "cxxNamespace": ["notification"],
  "ios": {
    "iosModuleName": "NitroNotification"
  },
  "android": {
    "androidNamespace": ["notification"],
    "androidCxxLibName": "NitroNotification"
  },
  "autolinking": {
    "Notification": {
      "ios": {
        "language": "swift",
        "implementationClassName": "HybridNotification"
      },
      "android": {
        "language": "kotlin",
        "implementationClassName": "HybridNotification"
      }
    }
  },
  "ignorePaths": ["**/node_modules"]
}
```

Key fields:

| Field | Purpose |
|---|---|
| `cxxNamespace` | C++ namespace for generated code (relative to `margelo::nitro`) |
| `iosModuleName` | Name of the iOS clang module (must match the `.podspec` name) |
| `androidNamespace` | Kotlin/Java package namespace (relative to `com.margelo.nitro`) |
| `androidCxxLibName` | Name of the native C++ library that JNI loads |
| `autolinking` | Maps Hybrid Object name → native class implementing it, per platform |

### Step 3. Write the HybridObject TypeScript spec

Open `packages/nitro-notification/src/Notification.nitro.ts`:

```typescript
import type { HybridObject } from 'react-native-nitro-modules';

export interface Notification
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  showNotification(title: string, body: string): void;
}
```

Key differences from a Turbo Module spec:
- The file is suffixed with `.nitro.ts` (Nitrogen scans for this naming convention).
- The interface extends `HybridObject<{ ios: 'swift', android: 'kotlin' }>` instead of `TurboModule`.
- The generic parameter specifies the **implementation language** per platform — `'swift'` means Nitrogen generates a Swift protocol; `'kotlin'` generates a Kotlin interface.
- There is no `TurboModuleRegistry.getEnforcing(...)` call — Hybrid Objects are created differently.

### Step 4. Export the Hybrid Object from JS

Open `packages/nitro-notification/src/index.ts`:

```typescript
import { NitroModules } from 'react-native-nitro-modules';
import type { Notification } from './Notification.nitro';

export type { Notification };

export const NotificationModule =
  NitroModules.createHybridObject<Notification>('Notification');
```

Instead of `TurboModuleRegistry.getEnforcing('NativeNotification')`, we use `NitroModules.createHybridObject<Notification>('Notification')`. The string `'Notification'` must match the key in the `autolinking` section of `nitro.json`.

### Step 5. Run Nitrogen to generate native specs

From the `packages/nitro-notification/` directory, run:

```sh
npx nitrogen
```

This generates native spec files into `nitrogen/generated/`:
- **Shared C++:** `HybridNotificationSpec.hpp` — the C++ base class.
- **iOS:** `HybridNotificationSpec.swift` — the Swift protocol your implementation conforms to, plus `NitroNotification+autolinking.rb` for CocoaPods.
- **Android:** `HybridNotificationSpec.kt` — the Kotlin abstract class, plus `NitroNotification+autolinking.gradle` and `NitroNotification+autolinking.cmake` for the Android build system. Also `NitroNotificationOnLoad.kt` and `NitroNotificationOnLoad.hpp` for JNI initialization.

> **Important:** The generated files should be committed to git. They are part of the library package, so consumers (including your app) don't need to run Nitrogen themselves.

> 💡 You are now here → `checkpoint-1`

---

## Part 3: Implement the Notification Nitro Module for iOS

With Nitro, iOS implementations use **Swift** — not Objective-C++. This is one of the major ergonomic improvements over Turbo Modules. Nitro uses the new [Swift ↔ C++ interop](https://www.swift.org/documentation/cxx-interop/) which is close to zero-overhead.

### Step 1. Implement the generated Swift protocol

Open `packages/nitro-notification/ios/HybridNotification.swift`:

```swift
import Foundation
import UserNotifications
import NitroModules

class HybridNotification: HybridNotificationSpec {
  func showNotification(title: String, body: String) throws {
    let content = UNMutableNotificationContent()
    content.title = title
    content.body = body
    content.sound = .default

    let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1, repeats: false)
    let request = UNNotificationRequest(
      identifier: UUID().uuidString,
      content: content,
      trigger: trigger
    )

    UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
  }
}
```

Key elements:
- **`HybridNotificationSpec`** — this is the Swift protocol generated by Nitrogen from your TypeScript spec. If your method signature doesn't match (wrong types, missing methods), the app won't compile.
- **`throws`** — Nitrogen-generated specs mark methods with `throws`, allowing you to throw Swift errors that propagate as JS exceptions.
- **No Objective-C at all** — unlike Turbo Modules (which require `.mm` files, `RCT_EXPORT_MODULE`, and `getTurboModule:`), Nitro uses pure Swift.
- **No registration macros** — the `autolinking` section in `nitro.json` handles registration automatically.

> 💡 **Comparison with Turbo Modules iOS:** In the Turbo Modules track, you create `RCTNativeNotification.h` (Obj-C header conforming to `NativeNotificationSpec` protocol), `RCTNativeNotification.mm` (Obj-C++ implementation with `RCT_EXPORT_MODULE` and `getTurboModule:`). With Nitro, it's a single Swift file — much more concise.

> 💡 You are now here → `checkpoint-2`

---

## Part 4: Implement the Notification Nitro Module for Android

On Android, Nitro's Kotlin implementation extends the Nitrogen-generated abstract class — similar conceptually to Turbo Modules, but with some important differences.

### Step 1. Implement the generated Kotlin spec

Open `packages/nitro-notification/android/src/main/java/com/margelo/nitro/notification/HybridNotification.kt`:

```kotlin
package com.margelo.nitro.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import androidx.annotation.Keep

@Keep
class HybridNotification : HybridNotificationSpec() {

  override fun showNotification(title: String, body: String) {
    val ctx = appContext ?: return

    val notificationManager =
      ctx.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    val channel = NotificationChannel(
      CHANNEL_ID,
      "Lottery Notifications",
      NotificationManager.IMPORTANCE_DEFAULT
    )
    notificationManager.createNotificationChannel(channel)

    val notification = android.app.Notification.Builder(ctx, CHANNEL_ID)
      .setContentTitle(title)
      .setContentText(body)
      .setSmallIcon(android.R.drawable.ic_dialog_info)
      .setAutoCancel(true)
      .build()

    notificationManager.notify(System.currentTimeMillis().toInt(), notification)
  }

  companion object {
    private const val CHANNEL_ID = "lottery_notifications"
    private var appContext: Context? = null

    fun init(context: Context) {
      appContext = context.applicationContext
    }
  }
}
```

Key elements:
- **`@Keep`** — prevents ProGuard from stripping this class in release builds, since Nitro constructs it from C++ via JNI.
- **`HybridNotificationSpec()`** — the Nitrogen-generated abstract class (not the Codegen-generated class used in Turbo Modules).
- **Context handling** — unlike Turbo Modules, Nitro's HybridObject doesn't receive a `ReactApplicationContext` in its constructor (it must be default-constructible). We use a static `init(context)` pattern, called from `MainApplication.onCreate()`.
- **No `NAME` companion + `getName()`** — Nitro handles naming through the `nitro.json` autolinking config.
- **No `ReactPackage` with `isTurboModule = true`** — Nitro has its own `NitroNotificationPackage.kt` that handles JNI initialization.

### Step 2. Understand the JNI wiring

The Android side requires three pieces of C++/Kotlin glue that Nitrogen generates:

**`cpp-adapter.cpp`** — the JNI entry point:
```cpp
#include <jni.h>
#include <fbjni/fbjni.h>
#include "NitroNotificationOnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return facebook::jni::initialize(vm, []() {
    margelo::nitro::notification::registerAllNatives();
  });
}
```

**`NitroNotificationPackage.kt`** — loads the native library:
```kotlin
class NitroNotificationPackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? = null
  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider { HashMap() }

  companion object {
    init {
      NitroNotificationOnLoad.initializeNative()
    }
  }
}
```

This package doesn't provide any React Native modules itself — it just triggers `initializeNative()` which loads the C++ library and calls `registerAllNatives()`.

### Step 3. Register the context in MainApplication.kt

In `android/app/src/main/java/com/mobile/MainApplication.kt`, add the Nitro notification context initialization:

```kotlin
import com.margelo.nitro.notification.HybridNotification

// In onCreate():
override fun onCreate() {
  super.onCreate()
  SoLoader.init(this, OpenSourceMergedSoMapping)
  HybridNotification.init(this)
  // ...
}
```

> 💡 **Comparison with Turbo Modules Android:** In the Turbo Modules track, you create `NotificationModule.kt` (extending `NativeNotificationSpec`), `NotificationPackage.kt` (extending `BaseReactPackage` with `isTurboModule = true`), and register the package in `getPackages()`. With Nitro, the package is autolinked and the module is constructed via JNI — you only implement the spec and provide the context.

> 💡 You are now here → `checkpoint-3`

---

## Part 5: Create the CustomButton Fabric Native Component for iOS

> **This section is identical to the Turbo Modules homework.** Nitro Modules handle native logic, not native views. For native views, we use React Native's Fabric with Codegen — the same approach as Turbo Modules.

### Step 1. Create the Fabric Component spec

The spec file `specs/CustomButtonNativeComponent.ts` defines the native view:

```typescript
import type { HostComponent, ViewProps } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

// eslint-disable-next-line @typescript-eslint/ban-types
type CustomButtonPressEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  text?: string;
  disabled?: boolean;
  onCustomButtonPress?: DirectEventHandler<CustomButtonPressEvent>;
}

export default codegenNativeComponent<NativeProps>(
  'CustomButton',
) as HostComponent<NativeProps>;
```

### Step 2. Configure Codegen in `package.json`

The `codegenConfig` in `mobile/package.json` is configured for **components only** (not modules — the module part is handled by Nitro):

```json
{
  "codegenConfig": {
    "name": "AppSpecs",
    "type": "components",
    "jsSrcsDir": "specs",
    "android": {
      "javaPackageName": "com.mobile.specs"
    },
    "ios": {
      "componentProvider": {
        "CustomButton": "RCTCustomButton"
      }
    }
  }
}
```

Notice `"type": "components"` instead of `"all"` — we only need Codegen for the Fabric view component.

### Step 3. Implement the iOS Fabric component

The iOS Fabric implementation in `ios/mobile/CustomButton/RCTCustomButton.h` and `RCTCustomButton.mm` is the same as in the Turbo Modules homework — extending `RCTViewComponentView`, implementing props via `updateProps:oldProps:`, and dispatching events via `CustomButtonEventEmitter`. See the Turbo Modules homework (Part 3) for the full implementation.

### Step 4. Implement the Android Fabric component

The Android Fabric implementation in `android/app/src/main/java/com/mobile/specs/` (`CustomButtonView.kt`, `CustomButtonViewManager.kt`, `CustomButtonPackage.kt`) is also identical to the Turbo Modules homework (Part 5).

> 💡 You are now here → `checkpoint-4`

---

## Part 6: Use the Nitro Module & Fabric Component in JavaScript

### Using the Notification Nitro Module

*Step 1.* Import the notification module from the local library:

```typescript
import { NotificationModule } from 'nitro-notification';
```

*Step 2.* Call `showNotification`. For example, in `AddLottery.tsx`:

```typescript
const onSubmit = () => {
  NotificationModule.showNotification(
    'Lottery Created',
    'Your new lottery has been added successfully!'
  );
};
```

> 💡 **Key difference from Turbo Modules:** With Turbo Modules, you import directly from the spec file (`import NativeNotification from '../specs/NativeNotification'`). With Nitro, you import from the library package (`import { NotificationModule } from 'nitro-notification'`). The Hybrid Object is already instantiated via `NitroModules.createHybridObject()` in the library's `index.ts`.

### Using the CustomButton Fabric Native Component

This is the same as the Turbo Modules homework:

```typescript
import CustomButton from '../specs/CustomButtonNativeComponent';
```

```tsx
<CustomButton
  text="Register"
  disabled={!formik.isValid}
  onCustomButtonPress={() => formik.handleSubmit()}
  style={{ width: 120, height: 44 }}
/>
```

> 💡 You are now here → `checkpoint-5`

---

## Summary: Turbo Modules vs. Nitro Modules vs. Fabric

| Aspect | Turbo Modules | Nitro Modules | Fabric Native Components |
|---|---|---|---|
| **Purpose** | Native logic (methods) | Native logic (methods, objects) | Native UI views |
| **JS interface** | `TurboModuleRegistry.getEnforcing()` | `NitroModules.createHybridObject()` | `codegenNativeComponent()` |
| **Spec file** | `Native*.ts` | `*.nitro.ts` | `*NativeComponent.ts` |
| **Code generator** | React Native Codegen | Nitrogen | React Native Codegen |
| **iOS implementation** | Objective-C++ (`.mm`) | Swift | Objective-C++ (`.mm`) |
| **Android implementation** | Kotlin extending Codegen spec | Kotlin extending Nitrogen spec | Kotlin ViewManager + Codegen delegate |
| **Module structure** | Inline in app | Separate library (recommended) | Inline in app |
| **Object model** | Flat module exports | Object-oriented (Hybrid Objects) | Component props + events |
| **Type safety** | Codegen-verified | Nitrogen-verified (compile-time) | Codegen-verified |
| **Performance** | ~116ms / 100k calls | ~7ms / 100k calls | N/A (rendering) |

### Key Takeaway

- Use **Nitro Modules** when you need high-performance native logic, want to write iOS code in Swift instead of Obj-C++, or want the object-oriented Hybrid Object pattern.
- Use **Turbo Modules** when you want to stay within React Native's built-in architecture without additional dependencies.
- Use **Fabric Native Components** (with Codegen) for all native views — both Turbo and Nitro tracks use the same Fabric approach for UI.
